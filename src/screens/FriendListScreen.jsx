import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert,
} from 'react-native';
import {
  getDocs, collection, query, orderBy,
} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import db from '../../firebaseConfig';
import Tab from '../components/Tab';
import AddButton from '../components/AddButton';
import FriendListItem from '../components/FriendListItem';

// const Yamaoka = require('../../assets/山岡士郎.png');
// const Kaihara = require('../../assets/海原雄山.png');
// const Torico = require('../../assets/トリコ.png');
// const Araiwa = require('../../assets/荒岩まこと.png');

export default function FriendListScrenn() {
  // const navigation = useNavigation();
  const [friendlist, setFriendList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const fetchFriendList = async () => {
    try {
      const ref = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(ref);
      const databaseFriendList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        databaseFriendList.push({
          birthday: data.birthday,
          createdAt: data.createdAt,
          email: data.email,
          name: data.name,
          ramen: data.ramen,
          topping: data.topping,
        });
      });
      setFriendList(databaseFriendList);
    } catch (error) {
      Alert.alert('データの読み込みに失敗しました');
    }
  };
  useEffect(() => {
    const loadFriendListData = async () => {
      setLoading(true);
      await fetchFriendList();
      setLoading(false);
    };

    loadFriendListData();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Tab label="フレンド" onPress={() => { }} active />
        <Tab
          label="回数券" 
          // onPress={() => {
          //   navigation.navigate('BookOfTicketScreen');
          // }}
        />
      </View>
      <View>
        <View style={styles.friendlistheader}>
          <Text style={styles.title}>フレンドリスト</Text>
          <AddButton label={'表示順\n▼最終来店'} />
          {/* <AddButton
            label={'フレンド\n追加'}
            onPress={() => {
              navigation.navigate('FriendSearchScreen');
            }}
          /> */}
        </View>
      </View>
      <ScrollView>
        {friendlist.map((friendlistComponent) => (
          <View key={friendlistComponent.name}>
            <FriendListItem
              birthday={friendlistComponent.birthday}
              createdAt={friendlistComponent.createdAt}
              email={friendlistComponent.email}
              name={friendlistComponent.name}
              ramen={friendlistComponent.ramen}
              topping={friendlistComponent.topping}
            />
          </View>
        ))}
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
    paddingLeft: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 2,
  },
});
