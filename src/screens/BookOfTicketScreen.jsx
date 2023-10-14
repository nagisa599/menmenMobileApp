import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image } from 'react-native';

import Tab from '../components/Tab';
import Button from '../components/Button';
import PassButton from '../components/PassButton';
import AddButton from '../components/AddButton';

export default function BookOfTicketScreen(props) {
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Tab
          label="フレンド"
          onPress={() => {
            navigation.navigate('FriendListScreen');
          }}
        />
        <Tab label="回数券" onPress={() => { }} active />
      </View>
      <ScrollView>
        <View style={styles.friendlistheader}>
          <Text style={styles.title}>チケット内容</Text>
          <AddButton label={'表示順\n▼有効期限'} />
          <AddButton
            label={'チケット\n購入'}
          />
        </View>
        <View style={styles.ticket}>
          <View style={styles.twoimages}>
            <Image
              source={require('../../assets/ramen1.jpg')}
              style={styles.image}
            />
            <Image
              source={require('../../assets/ramen2.jpg')}
              style={styles.image}
            />
          </View>
          <Text style={styles.ramenbook}>ラーメン回数券</Text>
          <Text style={{ paddingLeft: 10 }}>※有効期限は購入日から180日です</Text>
          <View style={styles.restticket}>
            <View>
              <Text>残り<Text style={styles.bigText}>10</Text>枚</Text>
              <Text>~2023/10/11 20:00:00</Text>
            </View>
            <PassButton label='利用する' onPress={() => { }} />
          </View>
        </View>
        <View style={styles.friendlistheader}>
          <Text style={styles.title}>チケット履歴</Text>
        </View>
        <ScrollView>
          <View style={styles.individual}>
            <Text style={styles.time}>2023/09/25 20:00:00</Text>
            <Text style={styles.fluctuation}>-1枚</Text>
            <Text style={styles.remarks}>使用</Text>
          </View>

          <View style={styles.tickethistory}>
            <Text>2023/09/25 19:15:32</Text>
            <Text>-2枚</Text>
            <Text>譲渡</Text>
          </View>

          <View style={styles.tickethistory}>
            <Text>2023/09/23 18:10:00</Text>
            <Text>+10枚</Text>
            <Text>購入</Text>
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
  image: {
    width: 160,
    height: 160,
    borderRadius: 5,
    margin: 5
  },
  ticketcontents: {
    alignContent: 'center'
  },
  friendlistheader: {
    marginTop: 14,
    marginBottom: 8,
    marginLeft: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  twoimages: {
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 4, height: 4 },
  },
  ticket: {
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
  },
  ramenbook: {
    fontSize: 20,
    paddingLeft: 10,
  },
  restticket: {
    borderTopWidth: 1,
    borderRadius:5,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    flexDirection: 'row',
    margin: 10,
  },
  bigText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'red',

  },
  individual: {
    marginBottom: 2,
    margintop: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  tickethistory: {
    flexDirection: 'row'
  },
  time: {
    fontFamily: 20
  },
  fluctuation: {
    fontSize: 20
  },
  remarks: {
    fontSize:20
  }
});
