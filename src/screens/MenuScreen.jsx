import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView,
} from 'react-native';
import Tab from '../components/Tab';
import Menu from '../components/Menu';

const hiyashityuka = require('../../assets/hiyashityuka.jpg');
const kakuni = require('../../assets/kakuni.jpg');

export default function MenuScreen(props) {
  const [menus, setMenu] = useState([]);
  useEffect(() => {
    const dummy = [];
    dummy.push({
      id: '0',
      image: hiyashityuka,
      name: '冷やし中華',
      price: 720,
      student: true,
      favorite: 4,
    });
    dummy.push({
      id: '1',
      image: kakuni,
      name: '角煮変更',
      price: 200,
      student: false,
      favorite: 3,
    });
    setMenu(dummy);
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
        <Menu menus={menus} />
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
