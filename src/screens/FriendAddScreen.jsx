import React, { useState, useEffect, useContext } from 'react';
import {
  doc, getDoc, arrayUnion, updateDoc,
} from 'firebase/firestore';
import {
  View, Text, StyleSheet, ScrollView, Image, Alert, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import db from '../../firebaseConfig';
import userInfoContext from '../utils/UserInfoContext';

export default function FriendAddScreen(props) {
  const { route, navigation } = props;
  const { name, uid } = route.params;
  const { userInfo } = useContext(userInfoContext);
  const { friends } = userInfo;
  // 検索されたユーザの情報をfirebaseから取得する
  /* firebaseからimageUrlを取得するまでの処理 */
  const [updatedAt, setUpdatedAt] = useState();
  const [createdAt, setCreatedAt] = useState();
  const [title, setTitle] = useState();
  const [ramen, setRamen] = useState();
  const [topping, setTopping] = useState();
  const [friendlist, setFriendlist] = useState();
  const fetchImageUrl = async (uid) => {
    try {
      const useruidRef = doc(db, 'users', uid);
      const userDocSnapshot = await getDoc(useruidRef);
      const userData = userDocSnapshot.data();
      const {
        updatedAt, createdAt, topping, title, imageUrl, friends
      } = userData;
      console.log(imageUrl);
      console.log('&&&&&&&&');
      setFriendlist(friends);
      setUpdatedAt(updatedAt.toDate().toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }));
      setCreatedAt(createdAt.toDate().toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }));
      setTitle(title);
      setRamen(ramen);
      setTopping(topping);
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
    const userfriendsRef = doc(db, 'users', userInfo.uid);
    const friendfriendsRef = doc(db, 'users', uid);
    try {
      // Firestoreのドキュメントを更新
      await updateDoc(userfriendsRef, {
        friends: arrayUnion(uid), // Firestoreに配列を保存
      });
      console.log('Firestoreが更新されました');
      await updateDoc(friendfriendsRef, {
        friendlist: arrayUnion(userInfo.uid),
      });
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
      {/* <View style={styles.tabContainer}>
        <Tab label="フレンド" onPress={() => { }} active />
        <Tab
          label="回数券"
          onPress={() => {
            navigation.navigate('BookOfTicketScreen');
          }}
        />
      </View> */}
      <ScrollView style={styles.profile}>
        <View style={styles.imageContainer}>
          <Image
            source={url ? { uri: url } : null}
            style={styles.image}
          />
        </View>
        <Text style={styles.profileinfo}>
          名前：
          { name }
        </Text>
        <Text style={styles.profileinfo}>
          登録日：
          { createdAt }

        </Text>
        <Text style={styles.profileinfo}>
          最終来店日：
          { updatedAt }
        </Text>
        <Text style={styles.profileinfo}>
          総ラーメン：
          { title }
        </Text>
        <View style={styles.imageContainer}>
          {/* <Image
            source={{ uri: ramen }}
            style={styles.image}
          />
          <Image
            source={{ uri: topping }}
            style={styles.image}
          /> */}
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.profileinforamen}>
            お気に入り
            {'\n'}
            ラーメン＆トッピング
          </Text>
        </View>
      </ScrollView>
      <View style={styles.buttoncontainer}>
        <TouchableOpacity
          style={styles.backbuttonContainer}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={styles.backbuttonText}>↩︎ 戻る</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.searchbuttonContainer}
          onPress={() => {
            isFriend(uid);
          }}
        >
          <Text style={styles.searchbuttonText}>友達登録する</Text>
        </TouchableOpacity>
        <View style={styles.errorView}>
          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        </View>
      </View>
    </View>
  );
}

FriendAddScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.string,
      uid: PropTypes.string,
    }),
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    margin: 10,
  },
  image: {
    width: 170,
    height: 170,
    borderRadius: 10,
    borderWidth: 2,
  },
  profile: {
    margin: 10,
    borderWidth: 5,
    borderColor: 'rgba(0, 0, 0, 0.1)',

  },
  profileinfo: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
    marginLeft: 20,
    marginTop: 5,
  },
  profileinforamen: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttoncontainer: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  backbuttonContainer: {
    backgroundColor: 'black',
    borderRadius: 10,
    alignSelf: 'center', // 自分自身を並べる。左側に
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    bottom: '1%',
    height: 70,
  },
  backbuttonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  searchbuttonContainer: {
    backgroundColor: 'orange',
    borderRadius: 10,
    alignSelf: 'center', // 自分自身を並べる。左側に
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    bottom: '1%',
    height: 70,
  },
  searchbuttonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  errorView: {
    position: 'absolute',
    top: -50,
    left: '15%',

  },
  errorText: {
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
