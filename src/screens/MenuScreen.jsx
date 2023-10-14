import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {
  getFirestore, collection, query, where, orderBy, getDocs,
} from 'firebase/firestore';
// eslint-disable-next-line import/no-extraneous-dependencies
import RNFS from 'react-native-fs';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import Menu from '../components/Menu';
// import LimitMenu from '../components/LimitMenu';
// import Topping from '../components/Topping';
import Tab from '../components/Tab';
import SmallTab from '../components/SmallTab';
import LoadingScreen from './LoadingScreen';

const hiyashityuka = require('../../assets/hiyashityuka.jpg');
const kakuni = require('../../assets/kakuni.jpg');

export default function MenuScreen(props) {
  const { navigation } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [regularmenus, setRegularMenu] = useState([]);
  const [limitemenus, setLimitmenus] = useState([]);
  const [toppingMenus, setToppingmenus] = useState([]);
  const [menuImageUrls, setMenuImageUrls] = useState([]);
  const [limitImageUrls, setLimitImageUrls] = useState([]);
  const [toppingImageUrls, setToppingImageUrls] = useState([]);
  const [currentTab, setCurrentTab] = useState('menu');

  const storage = getStorage();
  const db = getFirestore();

  async function downloadImage(imageURL) {
    const imageRef = ref(storage, imageURL);
    const url = await getDownloadURL(imageRef);

    const downloadDest = `${RNFS.DocumentDirectoryPath}/${imageURL.split('/').pop()}`;

    const options = {
      fromUrl: url,
      toFile: downloadDest,
    };

    try {
      await RNFS.downloadFile(options).promise;
      return downloadDest;
    } catch (error) {
      console.error('Error downloading the image', error);
      return null;
    }
  }

  const fetchData = async () => {
    try {
      // Regular menus
      const dummy = [
        {
          id: '1',
          imageURL: hiyashityuka,
          name: '冷やし中華',
          price: 720,
          student: true,
          favorite: 4,
          today: true,
        },
        {
          id: '2',
          imageURL: kakuni,
          name: '角煮変更',
          price: 200,
          student: false,
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
    console.log('limitMenu:', limitMenu);
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
      <View style={styles.shadowContainer}>
        <View style={styles.tabContainer}>
          <Tab label="メニュー" onPress={() => {}} active />
          <Tab label="その他" onPress={() => navigation.navigate('HomeScreen')} />
        </View>

        <View style={styles.newTabContainer}>
          <SmallTab label="レギュラー" onPress={() => setCurrentTab('menu')} active={currentTab === 'menu'} />
          <SmallTab label="期間限定" onPress={() => setCurrentTab('limit')} active={currentTab === 'limit'} />
          <SmallTab label="トッピング" onPress={() => setCurrentTab('topping')} active={currentTab === 'topping'} />
        </View>
        <View style={styles.explain}>
          <Text>ピンク色は今日食べられるメニューです！</Text>
        </View>
      </View>

      {currentTab === 'menu' && <Menu menus={regularmenus} imageUrls={menuImageUrls} />}
      {currentTab === 'limit' && <Menu menus={limitemenus} imageUrls={limitImageUrls} />}
      {currentTab === 'topping' && <Menu menus={toppingMenus} imageUrls={toppingImageUrls} />}
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
});
