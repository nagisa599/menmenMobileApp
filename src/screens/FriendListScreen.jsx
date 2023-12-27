import React, { useState, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import db from '../../firebaseConfig';

import SortModal from '../components/SortModal';
import FriendListItem from '../components/FriendListItem';
import userInfoContext from '../utils/UserInfoContext';

export default function FriendListScrenn() {
  const navigation = useNavigation();
  const { userInfo } = useContext(userInfoContext);
  // 現在ログインしているユーザーのフレンドをfirebaseから取り出す
  const [friendList, setFriendList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [displayOrderName, setDisplayOrderName] = useState('最終来店');
  useEffect(() => {
    const fetchFriendList = async () => {
      setLoading(true);
      try {
        const databaseFriendList = await Promise.all(
          userInfo.friends.map(async (friendUid) => {
            const friendDocRef = doc(db, 'users', friendUid);
            const friendDocSnap = await getDoc(friendDocRef);

            return friendDocSnap.exists() ? { friendUid, ...friendDocSnap.data() } : null;
          }),
        );
        setFriendList(databaseFriendList);
      } catch (error) {
        console.log('フレンドの読み込みに失敗', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFriendList();
  }, [userInfo.friends]);

  const sortFriendList = (list, option) => {
    switch (option) {
      case '名前':
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      case '登録日':
        return [...list].sort((a, b) => a.createdAt - b.createdAt);
      case '最終来店':
        return [...list].sort((a, b) => a.updatedAt - b.updatedAt);
      default:
        return list;
    }
  };

  const handleSort = (sortOption) => {
    const sortedList = sortFriendList(friendList, sortOption);
    setFriendList(sortedList);
    setDisplayOrderName(sortOption);
    setModalVisible(false);
  };
  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />; // ローディングインジケータのコンポーネントを表示
  }

  return (
    <View style={styles.container}>
      <View style={styles.friendlistheader}>

        <TouchableOpacity style={styles.displayOrder} onPress={() => setModalVisible(true)}>
          <Text style={styles.displayOrderLabel}>
            表示順
            {'\n'}
            ▶
            {displayOrderName}
          </Text>
        </TouchableOpacity>
        <SortModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          handleSort={handleSort}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('FriendSearchScreen');
          }}
          style={styles.addFriend}
        >
          <Text style={styles.addFriendLabel}>
            フレンド追加
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {friendList.map((friendListComponent) => (
          <FriendListItem
            key={friendListComponent.uid}
            uid={friendListComponent.uid}
            userimagePath={friendListComponent.imageUrl}
            friends={friendListComponent.friends}
            createdAt={friendListComponent.createdAt}
            updatedAt={friendListComponent.updatedAt}
            name={friendListComponent.name}
            ramenId={friendListComponent.ramen}
            toppingId={friendListComponent.topping}
            title={friendListComponent.title}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  friendlistheader: {
    height: '13%',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  displayOrder: {
    backgroundColor: 'orange',
    width: '45%',
    height: '100%',
    borderRadius: 5,
    justifyContent: 'center',
    // alignSelf: 'flex-start', // 自分自身を並べる。左側に
  },
  displayOrderLabel: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 6,
    paddingVertical: 6,
    color: '#ffffff',
  },
  addFriend: {
    backgroundColor: 'orange',
    width: '45%',
    height: '100%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'flex-start', // 自分自身を並べる。左側に
  },
  addFriendLabel: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 6,
    color: '#ffffff',
  },
  modalView: {
    flex: 0.5,
    top: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明の背景色
    margin: 10,
    borderRadius: 10,
  },
});
