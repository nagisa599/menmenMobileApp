import React from 'react';
import { View, StyleSheet } from 'react-native';

import Tab from '../components/Tab';

export default function RankingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Tab label="ランキング" onPress={() => {}} active />
        <Tab label="称号" onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30,
  },
});
