import React from 'react';
import {
  StyleSheet, TouchableOpacity, Text, View, Image,
} from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import { string, instanceOf } from 'prop-types';

export default function FriendListItem({
  birthday, createdAt, email, name, ramen, topping,
}) {
  return (
    <TouchableOpacity
      style={styles.individual}
      // onPress={() => {
			//   navigation.navigate('FriendDetailScreen');
      // }}
    >
      <View style={styles.sortinfo}>
        <Text style={styles.name}>{ name }</Text>
        <Text style={styles.date}>
          { createdAt.toDate().toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }) }

        </Text>
      </View>
    </TouchableOpacity>
  );
}

FriendListItem.propTypes = {
  birthday: string.isRequired,
  createdAt: instanceOf(Date).isRequired,
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
