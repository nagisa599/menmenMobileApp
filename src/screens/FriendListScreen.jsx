import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity,
} from 'react-native';
import { string, func, bool } from 'prop-types';

import Tab from '../components/Tab';
import AddButton from '../components/AddButton';

export default function (props) {
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
      <View>
        <View style={styles.friendlistheader}>
          <Text style={styles.title}>フレンドリスト</Text>
          <AddButton label={'表示順\n▼最終来店'} />
          <AddButton
            label={'フレンド\n追加'}
            onPress={() => {
              navigation.navigate('FriendSearchScreen');
            }}
          />
        </View>
      </View>
      <ScrollView style={styles.friendlist}>
        <TouchableOpacity
          style={styles.individual}
          onPress={() => {
            navigation.navigate('FriendDetailScreen');
          }}
        >
          <Image
            source={require('../../assets/fujiwarashi.jpg')}
            style={styles.image}
          />
          <View style={styles.sortinfo}>
            <Text style={styles.name}>フジワラ</Text>
            <Text style={styles.date}>2023/09/23 10:42</Text>
          </View>
          <View style={styles.basicinfo}>
            <Text style={styles.ranking}>ランキング: 10位</Text>
            <Text style={styles.degree}>称号　　　: ラーメン王</Text>
            <Text style={styles.favorite}>お気に入り: 塩ラーメン</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.individual}>
          <Image
            source={require('../../assets/fujiwarashi.jpg')}
            style={styles.image}
          />
          <View style={styles.sortinfo}>
            <Text style={styles.name}>フジワラ</Text>
            <Text style={styles.date}>2023/09/23 10:42</Text>
          </View>
          <View style={styles.basicinfo}>
            <Text style={styles.ranking}>ランキング: 10位</Text>
            <Text style={styles.degree}>称号　　　: ラーメン王</Text>
            <Text style={styles.favorite}>お気に入り: 塩ラーメン</Text>
          </View>
        </View>

        <View style={styles.individual}>
          <Image
            source={require('../../assets/fujiwarashi.jpg')}
            style={styles.image}
          />
          <View style={styles.sortinfo}>
            <Text style={styles.name}>フジワラ</Text>
            <Text style={styles.date}>2023/09/23 10:42</Text>
          </View>
          <View style={styles.basicinfo}>
            <Text style={styles.ranking}>ランキング: 10位</Text>
            <Text style={styles.degree}>称号　　　: ラーメン王</Text>
            <Text style={styles.favorite}>お気に入り: 塩ラーメン</Text>
          </View>
        </View>
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
  title: {
    fontSize: 24,
    textDecorationLine: 'underline',
    marginRight: 10,
  },
  friendlistheader: {
    marginTop: 14,
    marginBottom: 8,
    marginLeft: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendlist: {
    borderWidth: 1,
    borderBlockColor: 'rgba(0, 0, 0, 0.7)',
  },
  individual: {
    marginBottom: 2,
    margintop: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  name: {
    lineHeight: 40,
    fontSize: 20,
    fontWeight: 'bold',
  },
  sortinfo: {
    justifyContent: 'center',
    paddingLeft: 10,
  },
  basicinfo: {
    justifyContent: 'center',
    paddingLeft: 15,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 2,
  },
});
