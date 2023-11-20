import React, { useEffect, useState } from 'react';
import {
  StyleSheet, TouchableOpacity, Text, View, Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PropTypes, { string, instanceOf, number } from 'prop-types';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

export default function FriendListItem({
  imageUrl, friends, birthday, createdAt, updatedAt, email, name, ramen, topping, title,
}) {
  const [url, setUrl] = useState('');
  const storage = getStorage();
  const imageRef = ref(storage, imageUrl);
  const navigation = useNavigation();

  useEffect(() => {
    getDownloadURL(imageRef)
      .then((downloadUrl) => {
        setUrl(downloadUrl);
      })
      .catch((error) => {
        console.error('画像のダウンロードURLの取得に失敗しました: ', error);
      });
  }, [imageUrl]);
  console.log(url);
  return (
    <TouchableOpacity
      style={styles.individual}
      onPress={() => {
        navigation.navigate('FriendDetailScreen', {
          name,
          updatedAt,
          url,
        });
      }}
    >
      <View style={styles.sortinfo}>
        <Image source={{ uri: url }} style={{ width: 100, height: 100 }} />
        <Text style={styles.name}>{ name }</Text>
        <Text style={styles.date}>
          { updatedAt.toDate().toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }) }
        </Text>
        <Text>称号：</Text>
        <Text>ランキング：</Text>
      </View>
    </TouchableOpacity>
  );
}

FriendListItem.propTypes = {
  imageUrl: string.isRequired,
  birthday: string.isRequired,
  createdAt: PropTypes.any.isRequired,
  updatedAt: PropTypes.any.isRequired,
  email: string.isRequired,
  name: string.isRequired,
  ramen: string.isRequired,
  topping: string.isRequired,
  title: number.isRequired,
};

const styles = StyleSheet.create({
  individual: {
    marginBottom: 2,
    margintop: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});
