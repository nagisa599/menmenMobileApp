import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';

import Tab from '../components/Tab';
import SearchButton from '../components/SearchButton';

export default function BookOfTicketScreen(props) {
  const { navigation } = props;
  const [userId, setUserId] = useState('');
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Tab label="フレンド" onPress={() => { }} active />
        <Tab
          label="フレンド"
          onPress={() => {
            navigation.navigate('BookOfTicketScreen');
          }}
        />
      </View>
      <View style={styles.searchcontainer}>
        <Text style={styles.userID}>あなたのユーザID</Text>
        <Text style={styles.userIDnum}>123456789</Text>
        <Text style={styles.friendID}>友達のユーザID</Text>
        <TextInput
          style={styles.inputID}
          value={userId}
          onChangeText={(text) => setUserId(text)}
          maxLength={9}
        />
        <SearchButton
          label="検索"
          onPress={() => {
            navigation.navigate('FriendAddScreen');
          }}
        />
      </View>

    </View>
  );
}

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
  searchcontainer: {
    margin: 30,
    alignItems: 'center',
    borderWidth: 5,
    borderColor:'rgba(0, 0, 0, 0.1)',
    height: 300
  },
  userID: {
    fontSize: 28,
    lineHeight: 40
  },
  userIDnum: {
    fontSize: 24,
    borderWidth: 1,
    borderColor: 'black',
    lineHeight: 36,
    width: 250,
    marginBottom: 30,
    textAlign: 'center'
  },
  friendID: {
    fontSize: 28
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

});
