import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, Alert,
} from 'react-native';
import {
  getFirestore, getDocs, collection, query, where,
} from 'firebase/firestore';

import Tab from '../components/Tab';
import Menu from '../components/Menu';
import LoadingScreen from './LoadingScreen';

const hiyashityuka = require('../../assets/hiyashityuka.jpg');
const kakuni = require('../../assets/kakuni.jpg');

export default function LimitMenuScreen(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [regularmenus, setRegularMenu] = useState([]);
  const [limitemenus, setlimitmenus] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    // dummy（レギュラーメニューの追加）
    const dummy = [];
    dummy.push({
      image: hiyashityuka,
      name: '冷やし中華',
      price: 720,
      student: true,
      favorite: 4,
    });
    dummy.push({
      image: kakuni,
      name: '角煮変更',
      price: 200,
      student: false,
      favorite: 3,
    });
    setRegularMenu(dummy);
    // 期間限定メニューの追加
    const fetchLimitTimeMenu = async () => {
      try {
        const db = getFirestore();
        const ref = query(collection(db, 'ramens'), where('limit', '==', true));
        const querySnapshot = await getDocs(ref);
        const limitTimeMenu = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          limitTimeMenu.push({
            imageURL: data.imageURL,
            name: data.name,
            price: data.price,
            student: true,
            favorite: data.favorite,
          });
        });
        setlimitmenus(limitTimeMenu);
      } catch (error) {
        Alert.alert('データの読み込みに失敗しました');
      }
    };
    fetchLimitTimeMenu(); // 非同期関数を即座に呼び出す
    setIsLoading(false);
  }, []);
  const { navigation } = props;
  if (isLoading) {
    return <LoadingScreen />; // ローディング中の画面を表示
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Tab label="メニュー" onPress={() => {}} active />
        <Tab
          label="その他"
          onPress={() => {
            navigation.navigate('HomeScreen');
          }}
        />
      </View>
      <View style={styles.tabContainer}>
        <Tab label="メニュー" onPress={() => { navigation.navigate('MenuScreen'); }} />
        <Tab
          label="期間限定メニュー"
          onPress={() => {
          }}
          active
        />
      </View>
      <ScrollView>
        <Menu menus={regularmenus} />
        <LimitMenu menus={limitemenus} />
      </ScrollView>
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
});
