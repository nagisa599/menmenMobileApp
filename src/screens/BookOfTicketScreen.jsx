import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native'

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
        <Text>チケット内容</Text>
        <View>
          <View>
            <image></image>
            <image></image>
          </View>
          <Text>ラーメン回数券</Text>
          <Text>※有効期限は購入日から180日です</Text>
          <View>
            <View>
              <Text>残り10枚</Text>
              <Text>~2023/10/11 20:00:00</Text>
            </View>
            <Button label='利用する' onPress={() => {}} />
          </View>
        </View>
      </View>
      <View>
        <Text>チケット履歴</Text>
        <ScrollView>

        </ScrollView>
      </View>
    </View>
  )
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
