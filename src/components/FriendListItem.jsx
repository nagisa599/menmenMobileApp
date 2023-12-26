import React, { useEffect, useState } from 'react';
import {
  StyleSheet, TouchableOpacity, Text, View, Image, Button,
} from 'react-native';
import PropTypes, { string, number } from 'prop-types';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';


import fetchImage from '../utils/fetchImage';

export default function FriendListItem({
  userimagePath, createdAt, updatedAt, name, ramenId, toppingId, title,
}) {
  const [friendImageurl, setFriendImageUrl] = useState('');
  const [ramenImageurl, setRamenImageUrl] = useState('');
  const [toppingImageurl, setToppingImageUrl] = useState('');

  // #############################################################
  // firebaseのusersのimageUrlがimageURLに変わるまで
  const getDownloadableUrl = async (imagePath) => {
    const storage = getStorage();
    const imageRef = ref(storage, imagePath);
    try {
      const downloadedImageUrl = await getDownloadURL(imageRef);
      return downloadedImageUrl;
    } catch (error) {
      console.error('画像のダウンロードURLの取得に失敗しました', error);
      return null;
    }
  };
  // useEffect内では非同期処理を直接実行ではなく、非同期関数を定義してその関数を呼び出す必要がある
  useEffect(() => {
    const fetchUserImageUrl = async () => {
      try {
        const downloadedImageUrl = await getDownloadableUrl(userimagePath);
        setFriendImageUrl(downloadedImageUrl);
      } catch (error) {
        console.error('画像のダウンロードURLの取得に失敗しました', error);
      }
    };
    fetchUserImageUrl();
  }, [userimagePath]);
  // ###############################################################

  useEffect(() => {
    fetchImage('ramens', ramenId)
      .then((imageUrl) => {
        setRamenImageUrl(imageUrl);
      })
      .catch((error) => {
        console.log('エラー:', error);
      });
    fetchImage('ramens', toppingId)
      .then((imageUrl) => {
        setToppingImageUrl(imageUrl);
      })
      .catch((error) => {
        console.log('エラー:', error);
      });
  }, [ramenId, toppingId]);

  return (
    <TouchableOpacity
      style={styles.individual}
      // onPress={() => {
      //   navigation.navigate('FriendDetailScreen', {
      //     name,
      //     updatedAt,
      //     createdAt,
      //     url,
      //     ramen,
      //     topping,
      //     title,
      //   });
      // }}
    >
      <View style={styles.sortinfo}>
        <Image source={friendImageurl ? { uri: friendImageurl } : null} style={styles.image} />
        <View style={styles.textinfo}>
          <Text style={styles.name}>{ name }</Text>

          <Text style={styles.date}>
            最終来店日：
            { updatedAt.toDate().toLocaleString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }) }
          </Text>
          <Text>
            登録日：
            { createdAt.toDate().toLocaleString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }) }
          </Text>
          <Image source={ramenImageurl ? { uri: ramenImageurl } : null} style={styles.image} />
          <Image source={toppingImageurl ? { uri: toppingImageurl } : null} style={styles.image} />
          <Button title="❌" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

FriendListItem.propTypes = {
  userimagePath: string.isRequired,
  createdAt: PropTypes.shape({
    nanoseconds: PropTypes.number.isRequired,
    seconds: PropTypes.number.isRequired,
  }).isRequired,
  updatedAt: PropTypes.shape({
    nanoseconds: PropTypes.number.isRequired,
    seconds: PropTypes.number.isRequired,
  }).isRequired,
  name: string.isRequired,
  ramenId: string.isRequired,
  toppingId: string.isRequired,
  title: number.isRequired,
};

const styles = StyleSheet.create({
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    borderWidth: 2,
  },
  sortinfo: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    margin: 5,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
  },
  name: {
    fontSize: 30,
  },
  textinfo: {
    marginLeft: 20,
  },
});
