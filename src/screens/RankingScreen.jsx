import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, Alert,
} from 'react-native';
import {
  getDocs, collection, query, orderBy,
} from 'firebase/firestore';
import db from '../../firebaseConfig';
import RankingList from '../components/RankingList';
import LoadingScreen from './LoadingScreen';

export default function RankingScreen() {
  const [ranking, setRanking] = useState([]);
  const [isLoading, setLoading] = useState(false);

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
    const loadRankingData = async () => {
      setLoading(true);
      await fetchRanking();
      setLoading(false);
    };

    loadRankingData();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? <LoadingScreen /> : (
        <ScrollView>
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
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
  // listContainer: {
  //   paddingVertical: 30,
  //   backgroundColor: 'blue',
  // },
  subTitle: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  text: {
    fontSize: 20,
  },
});
