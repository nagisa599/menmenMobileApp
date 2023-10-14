import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';

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
        <Text>フレンドリスト</Text>
        <View>
          <Button label={'表示順\n最終来店'} />
          <Button label={'フレンド\n追加'} />
        </View>
      </View>
      <ScrollView>
        <View>
          <image>image</image>
          <View>
            <Text>フジワラ</Text>
            <Text>2023/09/23 10:42</Text>
          </View>
          <View>
            <Text>ランキング: 10</Text>
            <Text>称号</Text>
            <Text>お気に入り</Text>
          </View>
        </View>
      </ScrollView>
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
