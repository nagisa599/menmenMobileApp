import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, Alert,
} from 'react-native';
import {
  getFirestore, getDocs, collection, query, where,
} from 'firebase/firestore';

import Tab from '../components/Tab';
import Menu from '../components/Menu';
import LimitMenu from '../components/LimitMenu';

const hiyashityuka = require('../../assets/hiyashityuka.jpg');
const kakuni = require('../../assets/kakuni.jpg');

export default function MenuScreen(props) {
  const [regularmenus, setRegularMenu] = useState([]);
  const [limitemenus, setlimitmenus] = useState([]);
  useEffect(() => {
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
    const db = getFirestore();
    const ref = query(collection(db, 'ramens'), where('limit', '==', true));
    let unsubscribe = () => {};
    unsubscribe = getDocs(ref).then((onSnapshot) => {
      const limitTimeMenu = [];
      onSnapshot.forEach((doc) => {
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
    }, (error) => {
      console.log(error);
      Alert.alert('データの読み込みに失敗しました');
    });
    return unsubscribe;
  }, []);
  const { navigation } = props;
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
  },
});
