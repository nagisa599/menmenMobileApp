import React, { useState, useEffect, useContext } from 'react';
import {
  doc, getDoc, arrayUnion, updateDoc,
} from 'firebase/firestore';
import {
  View, Text, StyleSheet, ScrollView, Image, Alert,
} from 'react-native';
import PropTypes, { string, instanceOf, number } from 'prop-types';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import db from '../../firebaseConfig';
import Tab from '../components/Tab';
import PassButton from '../components/PassButton';
import BackButton from '../components/BackButton';
import userInfoContext from '../utils/UserInfoContext';

export default function FriendAddScreen(props) {
  const { route, navigation } = props;
  const { name, uid } = route.params;
  const { userInfo } = useContext(userInfoContext);
  const { friends } = userInfo;
  // 検索されたユーザの情報をfirebaseから取得する
  /* firebaseからimageUrlを取得するまでの処理 */
  const [imageUrl, setImageUrl] = useState(null);
  const fetchImageUrl = async (uid) => {
    try {
      const useruidRef = doc(db, 'users', uid);
      const userDocSnapshot = await getDoc(useruidRef);
      const userData = userDocSnapshot.data();
      const { imageUrl } = userData;
      return imageUrl;
    } catch (error) {
      Alert.alert('データの読み込みに失敗しました');
    }
  };
  /* firebaseからimageUrlを取得してからの処理 */
  const [url, setUrl] = useState('');
  const storage = getStorage();
  useEffect(() => {
    // 内部の非同期関数を定義
    const fetchAndSetUrl = async () => {
      try {
        const imageUrl = await fetchImageUrl(uid); // FirestoreからimageUrlを取得
        if (imageUrl) {
          const imageRef = ref(storage, imageUrl); // Storageの参照を作成
          const downloadUrl = await getDownloadURL(imageRef); // ダウンロードURLを取得
          setUrl(downloadUrl); // ステートを更新
        }
      } catch (error) {
        console.error('画像のダウンロードURLの取得に失敗しました: ', error);
      }
    };

    fetchAndSetUrl(); // 定義した関数を実行
  }, [uid]);

  const [errorMessage, setErrorMessage] = useState('');

  // 検索したユーザを友達登録する（firebaseに追加する）
  const addUserInFriends = async (uid) => {
    friends.push(uid);
    const userfriendsRef = doc(db, 'users', userInfo.uid);
    console.log(userInfo);
    console.log(userfriendsRef);
    console.log('########');
    try {
      // Firestoreのドキュメントを更新
      await updateDoc(userfriendsRef, {
        friends: arrayUnion(uid), // Firestoreに配列を保存
      });
      console.log('Firestoreが更新されました');
    } catch (error) {
      console.error('Firestoreの更新に失敗しました:', error);
    }
  };

  // すでに友達かどうかを確認する
  const isFriend = (uid) => {
    if (friends.includes(uid)) {
      console.log('This user is already a friend');
      setErrorMessage('このユーザーはすでにフレンドです');
    } else {
      console.log('yes');
      addUserInFriends(uid);
      navigation.navigate('FriendListScreen');
    }
  };
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
          source={{ uri: url }}
          style={styles.image}
        />
        <Text style={styles.profileinfo}>
          名前 :
          {' '}
          { name }
        </Text>
        <Text style={styles.profileinfo}>ランキング : 15位</Text>
        <Text style={styles.profileinfo}>称号 : ラーメン好き</Text>
        <Text style={styles.profileinfo}>最終来店 : 2023/10/10 18:55</Text>
        <Text style={styles.profileinfo}>総ラーメン : 13杯</Text>
        <Text style={styles.profileinfo}>今週のラーメン : 2杯</Text>
        <Text style={styles.profileinfo}>初来店日 : 2023/04/23</Text>
        <Text style={styles.profileinfo}>お気に入り : 冷やし中華</Text>
        <Text style={styles.profileinfo}>一言コメント : ラーメンハマってます!</Text>
      </ScrollView>
      <View style={styles.buttoncontainer}>
        <BackButton
          label="戻る"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <PassButton
          label="友達登録する"
          onPress={() => {
            isFriend(uid);
            console.log('');
          }}
        />
        {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
      </View>
    </View>
  );
}

FriendAddScreen.propTypes = {
  name: string.isRequired,
  uid: string.isRequired,
};

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
