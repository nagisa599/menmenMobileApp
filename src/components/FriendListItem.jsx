import React, { useEffect, useState } from 'react';
import {
  StyleSheet, TouchableOpacity, Text, View, Image, Button,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PropTypes, { string, number } from 'prop-types';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { doc, getDoc } from 'firebase/firestore';
import db from '../../firebaseConfig';

export default function FriendListItem({
  imageUrl, createdAt, updatedAt, name, ramen, topping, title,
}) {
  const [url, setUrl] = useState('');
  const storage = getStorage();
  const imageRef = ref(storage, imageUrl);
  const navigation = useNavigation();
  // const ramenDocRef = doc(db, 'ramens', ramen);
  // const friendDocSnap = getDoc(ramenDocRef);
  useEffect(() => {
    getDownloadURL(imageRef)
      .then((downloadUrl) => {
        setUrl(downloadUrl);
      })
      .catch((error) => {
        console.error('画像のダウンロードURLの取得に失敗しました: ', error);
      });
  }, [imageUrl]);
  return (
    <TouchableOpacity
      style={styles.individual}
      onPress={() => {
        navigation.navigate('FriendDetailScreen', {
          name,
          updatedAt,
          createdAt,
          url,
          ramen,
          topping,
          title,
        });
      }}
    >
      <View style={styles.sortinfo}>
        <Image source={url ? { uri: url } : null} style={styles.image} />
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
          <Text>
            ラーメン：

          </Text>
          <Text>
            トッピング：

          </Text>
          <Button title="❌" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

FriendListItem.propTypes = {
  imageUrl: string.isRequired,
  createdAt: PropTypes.shape({
    nanoseconds: PropTypes.number.isRequired,
    seconds: PropTypes.number.isRequired,
  }).isRequired,
  updatedAt: PropTypes.shape({
    nanoseconds: PropTypes.number.isRequired,
    seconds: PropTypes.number.isRequired,
  }).isRequired,
  name: string.isRequired,
  ramen: string.isRequired,
  topping: string.isRequired,
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
