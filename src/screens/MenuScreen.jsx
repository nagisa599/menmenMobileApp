import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet, Dimensions, Alert,
} from 'react-native';
import {
  getFirestore, collection, query, where, getDocs,
} from 'firebase/firestore';
import * as FileSystem from 'expo-file-system';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TabView, TabBar } from 'react-native-tab-view';
import {
  shape, string, arrayOf, oneOfType, number, bool,
} from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Menu from '../components/Menu';
import LoadingScreen from './LoadingScreen';
import createImagesDirectory from '../utils/createImagesDirectory';

function SceneComponent({
  route, regularmenus, limitemenus, toppingMenus,
}) {
  switch (route.key) {
    case 'menu':
      return <Menu menus={regularmenus} />;
    case 'limit':
      return <Menu menus={limitemenus} />;
    case 'topping':
      return <Menu menus={toppingMenus} />;
    default:
      return null;
  }
}
SceneComponent.propTypes = {
  route: shape({
    key: string.isRequired,
    title: string,
  }).isRequired,
  regularmenus: arrayOf(
    shape({
      id: string.isRequired,
      imageURL: oneOfType([string, number]).isRequired,
      name: string.isRequired,
      price: number.isRequired,
      student: bool.isRequired,
      favorite: number.isRequired,
      today: bool.isRequired,
    }),
  ).isRequired,
  limitemenus: arrayOf(
    shape({
      id: string.isRequired,
      imageURL: oneOfType([string, number]).isRequired,
      name: string.isRequired,
      price: number.isRequired,
      student: bool.isRequired,
      favorite: number.isRequired,
      today: bool.isRequired,
    }),
  ).isRequired,
  toppingMenus: arrayOf(
    shape({
      id: string.isRequired,
      imageURL: oneOfType([string, number]).isRequired,
      name: string.isRequired,
      price: number.isRequired,
      student: bool.isRequired,
      favorite: number.isRequired,
      today: bool.isRequired,
    }),
  ).isRequired,
};

export default function MenuScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [regularmenus, setRegularMenu] = useState([]);
  const [limitemenus, setLimitmenus] = useState([]);
  const [toppingMenus, setToppingmenus] = useState([]);
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: 'menu', title: 'レギュラー' },
    { key: 'limit', title: '日替わり' },
    { key: 'topping', title: 'トッピング' },
  ]);

  function isTodayInJapan(firebaseTimestamp) {
    if (!firebaseTimestamp) {
      return false;
    }

    const firebaseDate = firebaseTimestamp.toDate();

    // 日本のタイムゾーンに合わせて調整（日本はUTC+9）
    const japanDate = new Date(firebaseDate.getTime() + (9 * 60 * 60 * 1000));

    // 今日の日付を取得（日本時間）
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 時刻を0時0分0秒に設定

    // 日付が今日かどうかをチェック
    return today.getTime() === japanDate.setHours(0, 0, 0, 0);
  }

  const renderScene = ({ route }) => (
    <SceneComponent
      route={route}
      regularmenus={regularmenus}
      limitemenus={limitemenus}
      toppingMenus={toppingMenus}
    />
  );

  const storage = getStorage();
  const db = getFirestore();

  async function downloadImage(imageURL) {
    const imageRef = ref(storage, imageURL);
    const url = await getDownloadURL(imageRef);

    const filename = url.split('/').pop();

    await createImagesDirectory('menu');
    const relativePath = `menu/${filename}`;
    const downloadDest = `${FileSystem.documentDirectory}${relativePath}`;

    const downloadResult = await FileSystem.downloadAsync(url, downloadDest);

    if (downloadResult.status !== 200) {
      console.error('Error downloading the image:', downloadResult);
      return null;
    }

    return relativePath;
  }

  const fetchMenuAndUpdateCache = async () => {
    // 最後の更新日時を取得
    const lastUpdate = await AsyncStorage.getItem('last_update_menu');
    const lastUpdateDate = lastUpdate ? new Date(lastUpdate) : new Date(2010, 0, 1);
    // Firebaseから新しいメニューのみを取得
    const menuRef = query(collection(db, 'ramens'), where('updatedAt', '>', lastUpdateDate));
    const snapshot = await getDocs(menuRef);

    const newMenusPromises = snapshot.docs.map(async (doc) => {
      const data = doc.data();
      // 画像URLからローカルイメージURLをダウンロード
      const localImageURL = await downloadImage(data.imageURL);
      // ローカルイメージURLを含むオブジェクトを返す
      return {
        id: doc.id,
        imageURL: localImageURL,
        name: data.name,
        price: data.price,
        student: data.student,
        favorite: data.favorite,
        today: !data.today || (data.today && isTodayInJapan(data.today)),
        topping: data.topping,
        limit: data.limit,
      };
    });
    const newMenus = await Promise.all(newMenusPromises);

    const cachedMenusString = await AsyncStorage.getItem('cached_menus');
    const cachedMenus = cachedMenusString ? JSON.parse(cachedMenusString) : [];

    // idをキーとしてメニューをマップに格納
    const cachedMenusMap = new Map(cachedMenus.map((menu) => [menu.id, menu]));

    // 新しいメニューでキャッシュを更新し、既存のメニューは新しい情報で上書き
    newMenus.forEach((menu) => {
      cachedMenusMap.set(menu.id, menu);
    });

    // マップから配列に変換します
    const updatedMenusArray = Array.from(cachedMenusMap.values());

    // // todayがtrueのものを先頭に、falseのものは後にするためのソート関数
    const sortByToday = (a, b) => (b.today === true) - (a.today === true);

    // 分類されたメニュー配列を更新し、todayがtrueのものを先頭に
    const limitMenu = updatedMenusArray
      .filter((menu) => menu.limit === true && menu.topping === false)
      .sort(sortByToday);
    const toppingMenu = updatedMenusArray
      .filter((menu) => menu.topping === true)
      .sort(sortByToday);
    const regularMenu = updatedMenusArray
      .filter((menu) => !menu.limit && !menu.topping)
      .sort(sortByToday);

    // ステートとAsyncStorageを更新
    setRegularMenu(regularMenu);
    setLimitmenus(limitMenu);
    setToppingmenus(toppingMenu);
    await AsyncStorage.setItem('cached_menus', JSON.stringify(updatedMenusArray));

    // 更新日時を設定します
    await AsyncStorage.setItem('last_update_menu', new Date().toISOString());
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchMenuAndUpdateCache();
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        Alert.alert('通信に失敗');
      }
    };

    initializeData();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? <LoadingScreen content={'データ取得中\n(初回は少し長いです)'} /> : (
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={(props) => (
            <TabBar
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
              style={{ backgroundColor: 'gray' }}
              indicatorStyle={{ backgroundColor: 'orange', height: 3 }}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30,
  },
  newTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  shadowContainer: {
    backgroundColor: 'rgb(242, 242, 242)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.10,
    shadowRadius: 3.84,
    elevation: 5,
  },
  explain: {
    alignItems: 'center',
    paddingBottom: 15,
  },
  subContainer: {
    flex: 1,
  },
});
