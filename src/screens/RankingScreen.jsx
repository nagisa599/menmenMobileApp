import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, Text, ScrollView, Alert,
} from 'react-native';
import {
  getDocs, collection, query, orderBy,
} from 'firebase/firestore';
import db from '../../firebaseConfig';
import Tab from '../components/Tab';
import RankingList from '../components/RankingList';

export default function RankingScreen(props) {
  const [ranking, setRanking] = useState([]);
  const { navigation } = props;
  const fetchRanking = async () => {
    try {
      const ref = query(collection(db, 'ranking'), orderBy('times', 'desc'));
      const querySnapshot = await getDocs(ref);
      const databaseRanking = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        databaseRanking.push({
          name: data.name,
          times: data.times,
          updateTime: new Date(),
        });
      });
      setRanking(databaseRanking);
    } catch (error) {
      Alert.alert('データの読み込みに失敗しました');
    }
  };
  useEffect(() => {
    fetchRanking();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.shadowContainer}>
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
      </View>
      <ScrollView style={styles.listContainer}>
        {ranking.map((rankingComponent, index) => (
          <View key={rankingComponent.name}>
            <RankingList
              rank={index + 1}
              times={rankingComponent.times}
              name={rankingComponent.name}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shadowContainer: {
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30,
  },
  listContainer: {
    paddingTop: 30,
  },
  subTitle: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  text: {
    fontSize: 20,
  },
});
