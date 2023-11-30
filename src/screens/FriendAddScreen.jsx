import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import {
  View, Text, StyleSheet, ScrollView, Image, Alert,
} from 'react-native';
import PropTypes, { string, instanceOf, number } from 'prop-types';
import db from '../../firebaseConfig';
import Tab from '../components/Tab';
import PassButton from '../components/PassButton';
import BackButton from '../components/BackButton';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

export default function FriendAddScreen(props) {
  const { route, navigation } = props;
  const { name, uid } = route.params;
  // const [imageUrl, setImageUrl] = useState(null);
  // const [url, setUrl] = useState('');
  // useEffect(() => {
  //   const fetchImageUrl = async () => {
  //     try {
  //       const docRef = doc(db, 'users', uid);
  //       const docSnap = await getDoc(docRef);
  //       setImageUrl(docSnap.data().imageUrl);
  //     } catch (error) {
  //       console.error("Error fetching document: ", error);
  //     }
  //   };
  //   fetchImageUrl();
  // }, [uid]);
  // useEffect(() => {
  //   const storage = getStorage();
  //   const imageRef = ref(storage, imageUrl);
  //   getDownloadURL(imageRef)
  //     .then((downloadUrl) => {
  //       setUrl(downloadUrl);
  //     })
  //     .catch((error) => {
  //       console.error('画像のダウンロードURLの取得に失敗しました: ', error);
  //     });
  // }, [imageUrl]);
  // console.log(uid);
  // console.log(imageUrl);
  // console.log(url);
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
          // source={{ uri: url }}
          style={styles.image}
        />
        <Text style={styles.profileinfo}>名前 : { name }</Text>
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
        <PassButton label="友達登録する" />
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
