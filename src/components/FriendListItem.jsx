import React from 'react';
import {
  StyleSheet, TouchableOpacity, Text, View, Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { string, instanceOf, arrayOf } from 'prop-types';

export default function FriendListItem({
  imageUrl, friends, birthday, createdAt, updatedAt, email, name, ramen, topping,
}) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.individual}
      onPress={() => {
        navigation.navigate('FriendDetailScreen', {
          name,
          updatedAt,
        });
      }}
    >
      <View style={styles.sortinfo}>
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
  createdAt: instanceOf(Date).isRequired,
  updatedAt: instanceOf(Date).isRequired,
  email: string.isRequired,
  name: string.isRequired,
  ramen: string.isRequired,
  topping: string.isRequired,
};

const styles = StyleSheet.create({
  individual: {
    marginBottom: 2,
    margintop: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});
