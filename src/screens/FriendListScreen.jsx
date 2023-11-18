import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert,
} from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import db from '../../firebaseConfig';
import Tab from '../components/Tab';
import AddButton from '../components/AddButton';
import FriendListItem from '../components/FriendListItem';

export default function FriendListScrenn() {
  const navigation = useNavigation();
  const [friendlist, setFriendList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const auth = getAuth();
  const fetchFriendList = async () => {
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data();
      const friendsUIDs = userData.friends || [];

      const databaseFriendList = await Promise.all(
        friendsUIDs.map(async (uid) => {
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
  }, []);
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
      <ScrollView>

        {friendlist.map((friendlistComponent) => (
          <View key={friendlistComponent.name}>
            <FriendListItem
              imageUrl={friendlistComponent.imageUrl}
              friends={friendlistComponent.friends}
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
