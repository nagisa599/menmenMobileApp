import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import {
  collection, query, where, getDocs,
} from 'firebase/firestore';
import Tab from '../components/Tab';
import SearchButton from '../components/SearchButton';
import db from '../../firebaseConfig';

export default function FriendSearchScreen(props) {
  const { route, navigation } = props;
  const { friendlist } = route.params;
  console.log(friendlist.name);
  async function createUserDict() {
    const userRef = collection(db, 'username');
    const querySnapshot = await getDocs(userRef);
    const userDict = {};
    querySnapshot.forEach((doc) => {
      userDict[doc.id] = doc.data().uid;
    });
    return userDict;
  }
  const [userDict, setUserDict] = useState({});
  useEffect(() => {
    createUserDict().then((dict) => {
      setUserDict(dict);
    });
  }, []);
  const [inputUsername, setInputUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  function checkUsername(username) {
    if (userDict.hasOwnProperty(username)) {
      navigation.navigate('FriendAddScreen', { name: username, uid: userDict[username] });
    } else {
      console.log('no');
      setErrorMessage('入力されたユーザー名は存在しません。');
    }
  }
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
      <View style={styles.searchcontainer}>
        <Text style={styles.userID}>あなたのユーザーネーム</Text>
        {/* 名前で検索 */}
        <Text style={styles.userIDnum}>123456789</Text>
        <Text style={styles.friendID}>友達のユーザーネーム</Text>
        <TextInput
          style={styles.inputID}
          maxLength={20}
          value={inputUsername}
          onChangeText={setInputUsername}
          autoCapitalize="none"
        />
        <SearchButton
          label="検索"
          onPress={() => {
            checkUsername(inputUsername);
          }}
        />
        {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
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
  searchcontainer: {
    margin: 30,
    alignItems: 'center',
    borderWidth: 5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    height: 300,
  },
  userID: {
    fontSize: 28,
    lineHeight: 40,
  },
  userIDnum: {
    fontSize: 24,
    borderWidth: 1,
    borderColor: 'black',
    lineHeight: 36,
    width: 250,
    marginBottom: 30,
    textAlign: 'center',
  },
  friendID: {
    fontSize: 28,
  },
  inputID: {
    fontSize: 24,
    borderWidth: 1,
    borderColor: 'black',
    lineHeight: 36,
    width: 250,
    marginBottom: 30,
    textAlign: 'center',
  },
});
