import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';

import Tab from '../components/Tab';
import Button from '../components/Button';

export default function BookOfTicketScreen(props) {
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Tab label="回数券" onPress={() => { }} active />
        <Tab
          label="フレンド"
          onPress={() => {
            navigation.navigate('FriendList');
          }}
        />
      </View>
      <View>
        <Text>あなたのユーザID</Text>
        <TextInput />
        <Text>友達のユーザID</Text>
        <TextInput />
        <Button label='検索' />
      </View>

    </View>
  );
}

Button.propTypes = {
  label: string.isRequired,
  onPress: func,
};

Button.defaultProps = {
  onPress: null,
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
});
