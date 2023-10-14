import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';

import Tab from '../components/Tab';
import Button from '../components/Button';

export default function BookOfTicketScreen(props) {
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Tab label="フレンド" onPress={() => { }} active />
        <Tab
          label="回数券"
          onPress={() => {
            navigation.navigate('BookOfTicket');
          }}
        />
      </View>
      <View>
        <image>image</image>
        <Text>名前: フジワラ</Text>
        <Text>ランキング: 10位</Text>
        <Text>称号: ラーメン王</Text>
        <Text>最終来店</Text>
      </View>
      <View>
        <Button label='戻る' />
        <Button label='友達登録する' />
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
