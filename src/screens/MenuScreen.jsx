import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, Text, ScrollView,
} from 'react-native';
import Tab from '../components/Tab';
import Menu from '../components/Menu';

export default function MenuScreen(props) {
  const [menus, setMenu] = useState([]);
  useEffect(() => {
    const dummy = [];
    dummy.push({
      id: '0',
      name: 'とんこつラーメン',
      price: 720,
      quantity: 200,
      favorite: 4,
    });
    dummy.push({
      id: '1',
      name: 'みそラーメン',
      price: 120,
      quantity: 2000,
      favorite: 4,
    });
    setMenu(dummy);
  }, []);
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Tab
          label="その他"
          onPress={() => {
            navigation.navigate('HomeScreen');
          }}
        />
        <Tab label="メニュー" onPress={() => {}} active />
      </View>
      <ScrollView>
        <View style={styles.menuBox}>
          <View style={styles.menuPicture}>
            <Text>写真</Text>
          </View>
          <Text style={styles.menudetail}>ラーメン</Text>
          <Text>９８０円</Text>
          <Text>200グラム</Text>
          <Text>★</Text>
        </View>
        <Menu menus={menus} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30,
  },
  menuBox: {
    // marginTop: 20,
    paddingVertical: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '65%',
  },
  menuPicture: {
    backgroundColor: 'blue',
    height: 160,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});
