import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Modal, ActivityIndicator,
} from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import db from '../../firebaseConfig';
import AddButton from '../components/AddButton';
import FriendListItem from '../components/FriendListItem';
import userInfoContext from '../utils/UserInfoContext';

export default function FriendListScrenn() {
  const navigation = useNavigation();
  const { userInfo } = useContext(userInfoContext);
  const [friendlist, setFriendList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  // 現在ログインしているユーザーのフレンドをfirebaseから取り出す
  const fetchFriendList = async () => {
    try {
      const databaseFriendList = await Promise.all(
        userInfo.friends.map(async (uid) => {
          const friendDocRef = doc(db, 'users', uid);
          const friendDocSnap = await getDoc(friendDocRef);
          if (friendDocSnap.exists()) {
            return { uid, ...friendDocSnap.data() };
          }
          return null;
        }),
      );
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
  }, [userInfo.friends]);
  const [modalVisible, setModalVisible] = useState(false);
  const [displayOrderName, setDisplayOrderName] = useState('最終来店');
  const handleSort = (sortOption) => {
    const sortedList = [...friendlist];
    switch (sortOption) {
      case 'sortByCreationDate':
        sortedList.sort((a, b) => a.createdAt - b.createdAt);
        setDisplayOrderName('登録日');
        break;
      case 'sortByName':
        sortedList.sort((a, b) => a.name.localeCompare(b.name));
        setDisplayOrderName('名前');
        break;
      case 'sortByLastVisit':
        sortedList.sort((a, b) => b.updatedAt - a.updatedAt);
        setDisplayOrderName('最終来店');
        break;
      default:
        break;
    }
    setFriendList(sortedList);
    setModalVisible(false);
  };
  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />; // ローディングインジケータのコンポーネントを表示
  }
  return (
    <View style={styles.container}>
      {/* <View style={styles.tabContainer}>
        <Tab label="フレンド" onPress={() => { }} active />
        <Tab
          label="回数券"
          onPress={() => {
            navigation.navigate('BookOfTicketScreen');
          }}
        />
      </View> */}
      <View>
        <View style={styles.friendlistheader}>
          <Text style={styles.title}>フレンドリスト</Text>
          <TouchableOpacity style={styles.displayOrder} onPress={() => setModalVisible(true)}>
            <Text style={styles.displayOrderLabel}>
              表示順
              {'\n'}
              ▶
              {displayOrderName}
            </Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.buttonStyle} onPress={() => handleSort('sortByCreationDate')}>
                <Text style={styles.buttonText}>登録日</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonStyle} onPress={() => handleSort('sortByName')}>
                <Text style={styles.buttonText}>名前</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonStyle} onPress={() => handleSort('sortByLastVisit')}>
                <Text style={styles.buttonText}>最終来店</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonStyle} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>↩︎ 閉じる</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <AddButton
            label={'フレンド\n追加'}
            onPress={() => {
              navigation.navigate('FriendSearchScreen');
            }}
          />
        </View>
      </View>
      <ScrollView>

        {friendlist.map((friendlistComponent) => (
          <View key={friendlistComponent.name}>
            <FriendListItem
              imageUrl={friendlistComponent.imageUrl}
              friends={friendlistComponent.friends}
              birthday={friendlistComponent.birthday}
              createdAt={friendlistComponent.createdAt}
              updatedAt={friendlistComponent.updatedAt}
              name={friendlistComponent.name}
              ramen={friendlistComponent.ramen}
              topping={friendlistComponent.topping}
              title={friendlistComponent.title}
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
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 10,
    color: 'orange',
  },
  friendlistheader: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  displayOrder: {
    backgroundColor: 'orange',
    width: 100,
    borderRadius: 5,
    marginRight: 10,
    // alignSelf: 'flex-start', // 自分自身を並べる。左側に
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  displayOrderLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
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
  buttonStyle: {
    width: 150,
    padding: 10,
    margin: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
});
