import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet, TouchableOpacity, Text, View, Image, Button,
} from 'react-native';
import PropTypes, { string, number, any, object } from 'prop-types';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

import userInfoContext from '../utils/UserInfoContext';
import fetchImage from '../utils/fetchImage';
import useCalcDaysDiff from '../utils/useCalcDaysDiff';
import useChangeFriendList from '../utils/useChangeFriends';

export default function FriendListItem({
  uid, userimagePath, createdAt, updatedAt, name, ramenId, toppingId, title, friends,
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

  const dispWeek = useCalcDaysDiff(updatedAt);
  const changeFriendList = useChangeFriendList();

  return (
    <TouchableOpacity>
      <View style={styles.indivisual}>
        <Image source={friendImageurl ? { uri: friendImageurl } : null} style={styles.userImage} />
        <View style={styles.textinfo}>
          <Text style={styles.userName}>{ name }</Text>
          <Text style={styles.date}>
            最終来店日：
            {dispWeek}
          </Text>
          <Text>
            登録日：
            { createdAt.toDate().toLocaleString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }) }
          </Text>
        </View>
        <Image source={ramenImageurl ? { uri: ramenImageurl } : null} style={styles.ramenImage} />
        <Image
          source={toppingImageurl ? { uri: toppingImageurl } : null}
          style={styles.toppingImage}
        />
        <Button onPress={() => changeFriendList('remove', uid, name)} title="❌" />
      </View>
    </TouchableOpacity>
  );
}

FriendListItem.propTypes = {
  uid: string.isRequired,
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
  friends: PropTypes.arrayOf(PropTypes.string),
};

FriendListItem.defaultProps = {
  friends: [], // デフォルト値として空の配列を設定
};

const styles = StyleSheet.create({
  indivisual: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    margin: 5,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
  },
  userImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    borderWidth: 2,
  },
  ramenImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
  },
  toppingImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
  },
  userName: {
    fontSize: 30,
  },
  textinfo: {
    marginLeft: 20,
  },
});
