import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import Tab from '../components/Tab';
import CircleTitle from '../components/CircleTitle';

export default function TitleScreen(props) {
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Tab
          label="ランキング"
          onPress={() => {
            navigation.navigate('RankingScreen');
          }}
        />
        <Tab label="称号" onPress={() => {}} active />
      </View>
      <View>
        <View style={styles.firstTextContainer}>
          <Text style={styles.firstText}>あなたの称号は・・・</Text>
        </View>
        <View style={styles.circle}>
          <CircleTitle content="ちょいラーメン好き" />
        </View>
        <View style={styles.lastTextContainer}>
          <Text style={styles.lastText}>です！</Text>
        </View>
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
  firstTextContainer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 30,
  },
  firstText: {
    fontSize: 30,
  },
  circle: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  lastTextContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 30,
  },
  lastText: {
    fontSize: 30,
  },
});
