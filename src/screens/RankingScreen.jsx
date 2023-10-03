import React from 'react';
import {
  View, StyleSheet, Text, ScrollView,
} from 'react-native';

import Tab from '../components/Tab';
import RankingList from '../components/RankingList';

export default function RankingScreen(props) {
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Tab label="ランキング" onPress={() => {}} active />
        <Tab
          label="称号"
          onPress={() => {
            navigation.navigate('TitleScreen');
          }}
        />
      </View>
      <View style={styles.subTitle}>
        <Text style={styles.text}>直近3ヶ月の来店回数</Text>
      </View>
      <ScrollView style={styles.listContainer}>
        <RankingList rank={1} times={30} />
        <RankingList rank={2} times={24} />
        <RankingList rank={3} times={20} />
        <RankingList rank={4} times={19} />
      </ScrollView>
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
  },
  subTitle: {
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
  listContainer: {
    marginTop: 20,
  },
});
