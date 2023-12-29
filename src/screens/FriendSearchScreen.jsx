import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
} from 'react-native';
import { getDoc, doc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import db from '../../firebaseConfig';

import userInfoContext from '../utils/UserInfoContext';

export default function FriendSearchScreen(props) {
  const { navigation } = props;
  const { userInfo } = useContext(userInfoContext);
  const [inputUsername, setInputUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const checkUserExists = async (username) => {
    const userRef = doc(db, 'username', username);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      navigation.navigate('FriendAddScreen', { friendName: username, friendUid: docSnap.data().uid });
      console.log('遷移成功');
    } else {
      setErrorMessage('入力されたユーザーは存在しません。');
      console.log('入力されたユーザーは存在しない');
    }
  };

  // usernameをkey, uidをvalueとして辞書を作成する
  // async function createUserDict() {
  //   const userRef = collection(db, 'username');
  //   const querySnapshot = await getDocs(userRef);
  //   const userDict = {};
  //   querySnapshot.forEach((doc) => {
  //     userDict[doc.id] = doc.data().uid;
  //   });
  //   return userDict;
  // }
  // const [userDict, setUserDict] = useState({});
  // useEffect(() => {
  //   createUserDict().then((dict) => {
  //     setUserDict(dict);
  //   });
  // }, []);
  // const [inputUsername, setInputUsername] = useState('');
  // const [errorMessage, setErrorMessage] = useState('');
  // function checkUsername(username) {
  //   if (Object.prototype.hasOwnProperty.call(userDict, username)) {
  //     navigation.navigate('FriendAddScreen', { name: username, uid: userDict[username] });
  //   } else {
  //     setErrorMessage('入力されたユーザーは存在しません。');
  //   }
  // }
  return (
    <View style={styles.container}>
      <View style={styles.searchcontainer}>
        <Text style={styles.userID}>あなたのユーザーネーム</Text>
        {/* 名前で検索 */}
        <Text style={styles.userIDnum}>{ userInfo.name }</Text>
        <Text style={styles.friendID}>友達のユーザーネーム</Text>
        <TextInput
          style={styles.inputID}
          maxLength={20}
          value={inputUsername}
          onChangeText={setInputUsername}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.searchbuttonContainer}
          onPress={() => {
            checkUserExists(inputUsername);
          }}
        >
          <FontAwesome name="search" size={24} color="white" />
          <Text style={styles.searchbuttonText}> 検索</Text>
        </TouchableOpacity>
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      </View>
      <TouchableOpacity
        style={styles.backbuttonContainer}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Text style={styles.backbuttonText}>↩︎ 戻る</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: '15%',
    alignItems: 'center',
  },
  searchcontainer: {
    padding: 20,
    alignItems: 'center',
    borderWidth: 5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    height: 330,
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
  backbuttonContainer: {
    backgroundColor: 'black',
    borderRadius: 10,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    top: 20,
    height: 70,
  },
  backbuttonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  searchbuttonContainer: {
    backgroundColor: 'orange',
    borderRadius: 10,
    alignSelf: 'center', // 自分自身を並べる。左側に
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: 10,
    bottom: '1%',
    height: 70,
  },
  searchbuttonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  errorText: {
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
