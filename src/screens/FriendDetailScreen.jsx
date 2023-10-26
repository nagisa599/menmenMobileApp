import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
} from 'react-native';

import Tab from '../components/Tab';
import PassButton from '../components/PassButton';
import BackButton from '../components/BackButton';

const Yamaoka = require('../../assets/山岡士郎.png');

export default function BookOfTicketScreen(props) {
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Tab label="フレンド" onPress={() => { }} active />
        <Tab
          label="回数券"
          onPress={() => {
            navigation.navigate('BookOfTicketScreen');
          }}
        />
      </View>
      <ScrollView style={styles.profile}>
        <Image
          source={Yamaoka}
          style={styles.image}
        />
        <Text style={styles.profileinfo}>名前 : 山岡士郎</Text>
        <Text style={styles.profileinfo}>ランキング : 2位</Text>
        <Text style={styles.profileinfo}>称号 : ラーメンスター</Text>
        <Text style={styles.profileinfo}>最終来店 : 2023/10/13 19:15</Text>
        <Text style={styles.profileinfo}>総ラーメン : 123杯</Text>
        <Text style={styles.profileinfo}>今週のラーメン : 4杯</Text>
        <Text style={styles.profileinfo}>初来店日 : 2021/08/21</Text>
        <Text style={styles.profileinfo}>お気に入り : ラーメン汁なし</Text>
        <Text style={styles.profileinfo}>一言コメント : No ramen no life !</Text>
      </ScrollView>
      <View style={styles.buttoncontainer}>
        <BackButton
          label="戻る"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <PassButton label="回数券を渡す" />
      </View>
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
  image: {
    width: 125,
    height: 125,
    borderRadius: 10,
    borderWidth: 2,
    marginLeft: 110,
    marginTop: 10,
  },
  profile: {
    margin: 10,
    height: 100,
    borderWidth: 5,
    borderColor: 'rgba(0, 0, 0, 0.1)',

  },
  profileinfo: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
    marginLeft: 20,
    marginTop: 5,
  },
  buttoncontainer: {
    flexDirection: 'row',
    alignContent: 'space-between',
  },
});