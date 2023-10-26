import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet, Dimensions,
} from 'react-native';
import {
  getFirestore, collection, query, where, orderBy, getDocs,
} from 'firebase/firestore';
import * as FileSystem from 'expo-file-system';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TabView, TabBar } from 'react-native-tab-view';
import {
  shape, string, arrayOf, oneOfType, number, bool,
} from 'prop-types';
import Menu from '../components/Menu';
// import SmallTab from '../components/SmallTab';
import LoadingScreen from './LoadingScreen';

const ramen = require('../../assets/ramen.jpg');
const halframen = require('../../assets/halframen.jpg');

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
    { key: 'limit', title: '期間限定' },
    { key: 'topping', title: 'トッピング' },
  ]);

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
    const downloadDest = `${FileSystem.documentDirectory}${filename}`;

    const downloadResult = await FileSystem.downloadAsync(url, downloadDest);

    if (downloadResult.status !== 200) {
      console.error('Error downloading the image:', downloadResult);
      return null;
    }

    return downloadResult.uri;
  }

  const fetchData = async () => {
    try {
      // Regular menus
      const dummy = [
        {
          id: '1',
          imageURL: ramen,
          name: 'ラーメン',
          price: 980,
          student: true,
          favorite: 4,
          today: true,
        },
        {
          id: '2',
          imageURL: halframen,
          name: '半ラーメン',
          price: 880,
          student: true,
          favorite: 3,
          today: true,
        },
      ];
      setRegularMenu(dummy);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchLimitMenu = async () => {
    const limitRef = query(collection(db, 'ramens'), where('limit', '==', true), orderBy('today', 'desc'));
    const limitSnapshot = await getDocs(limitRef);

    const limitMenuPromises = limitSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const localImageURL = await downloadImage(data.imageURL);
      return {
        id: doc.id,
        imageURL: localImageURL,
        name: data.name,
        price: data.price,
        student: data.student,
        favorite: data.favorite,
        today: data.today,
      };
    });
    const limitMenu = await Promise.all(limitMenuPromises);
    setLimitmenus(limitMenu);
  };

  const fetchToppingMenu = async () => {
    const toppingRef = query(collection(db, 'ramens'), where('topping', '==', true), orderBy('today', 'desc'));
    const toppingSnapshot = await getDocs(toppingRef);

    const toppingMenuPromises = toppingSnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const localImageURL = await downloadImage(data.imageURL);
      return {
        id: doc.id,
        imageURL: localImageURL,
        name: data.name,
        price: data.price,
        student: data.student,
        favorite: data.favorite,
        today: data.today,
      };
    });

    const toppingMenu = await Promise.all(toppingMenuPromises);
    setToppingmenus(toppingMenu);
  };

  useEffect(() => {
    const fetchDataAndSetLoading = async () => {
      await fetchData();
      await fetchLimitMenu();
      await fetchToppingMenu();
      setIsLoading(false);
    };
    fetchDataAndSetLoading();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
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
            indicatorStyle={{ backgroundColor: 'tomato', height: 3 }}
          />
        )}
      />
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
