import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
} from 'react-native';

import Tab from '../components/Tab';
import UseButton from '../components/UseButton';
import AddButton from '../components/AddButton';

// const ramen1url = require('../../assets/ramen1.jpg');
// const ramen2url = require('../../assets/ramen2.jpg');

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
              source={ramen1url}
              style={styles.image}
            />
            <Image
              source={ramen2url}
              style={styles.image}
            />
          </View>
          <Text style={styles.ramenbook}>ラーメン回数券</Text>
          <Text style={{ paddingLeft: 10 }}>※有効期限は購入日から180日です</Text>
          <View style={styles.restticket}>
            <View>
              <Text>
                残り
                <Text style={styles.bigText}>
                  10
                </Text>
                枚
              </Text>
              <Text>~2023/10/11 20:00:00</Text>
            </View>
            <UseButton label="利用する" onPress={() => { }} />
          </View>
        </View>
        <View style={styles.friendlistheader}>
          <Text style={styles.title}>チケット履歴</Text>
        </View>
        <ScrollView style={styles.ticketcontainer}>
          <View style={styles.tickethistory}>
            <Text style={styles.time}>{'2023/10/15\n20:05:32'}</Text>
            <Text style={styles.fluctuation}>-1枚</Text>
            <Text style={styles.remarks}>使用</Text>
          </View>

          <View style={styles.tickethistory}>
            <Text style={styles.time}>{'2023/10/10\n19:15:22'}</Text>
            <Text style={styles.fluctuation}>-2枚</Text>
            <Text style={styles.remarks}>譲渡</Text>
          </View>

          <View style={styles.tickethistory}>
            <Text style={styles.time}>{'2023/10/06\n18:10:00'}</Text>
            <Text style={styles.fluctuation}>-1枚</Text>
            <Text style={styles.remarks}>使用</Text>
          </View>

          <View style={styles.tickethistory}>
            <Text style={styles.time}>{'2023/10/01\n19:42:53'}</Text>
            <Text style={styles.fluctuation}>-1枚</Text>
            <Text style={styles.remarks}>使用</Text>
          </View>

          <View style={styles.tickethistory}>
            <Text style={styles.time}>{'2023/09/30\n18:55:31'}</Text>
            <Text style={styles.fluctuation}>+10枚</Text>
            <Text style={styles.remarks}>購入</Text>
          </View>

          <View style={styles.tickethistory}>
            <Text style={styles.time}>{'2023/09/28\n20:08:35'}</Text>
            <Text style={styles.fluctuation}>-1枚</Text>
            <Text style={styles.remarks}>使用</Text>
          </View>

          <View style={styles.tickethistory}>
            <Text style={styles.time}>{'2023/09/25\n19:15:32'}</Text>
            <Text style={styles.fluctuation}>-2枚</Text>
            <Text style={styles.remarks}>譲渡</Text>
          </View>

          <View style={styles.tickethistory}>
            <Text style={styles.time}>{'2023/09/23\n18:15:12'}</Text>
            <Text style={styles.fluctuation}>-3枚</Text>
            <Text style={styles.remarks}>譲渡</Text>
          </View>

          <View style={styles.tickethistory}>
            <Text style={styles.time}>{'2023/09/22\n20:01:16'}</Text>
            <Text style={styles.fluctuation}>-1枚</Text>
            <Text style={styles.remarks}>使用</Text>
          </View>

          <View style={styles.tickethistory}>
            <Text style={styles.time}>{'2023/09/20\n19:30:36'}</Text>
            <Text style={styles.fluctuation}>+10枚</Text>
            <Text style={styles.remarks}>購入</Text>
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
    margin: 5,
  },
  ticketcontents: {
    alignContent: 'center',
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
    borderRadius: 5,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    flexDirection: 'row',
    margin: 10,
  },
  bigText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'red',

  },
  ticketcontainer: {
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    height: 400,
  },
  tickethistory: {
    marginBottom: 2,
    margintop: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  time: {
    fontSize: 20,
  },
  fluctuation: {
    fontSize: 30,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    width: 100,
  },
  remarks: {
    fontSize: 20,
    position: ' absolute',
    right: -90,
  },
});
