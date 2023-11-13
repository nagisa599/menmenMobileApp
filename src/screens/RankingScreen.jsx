import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, Text,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
// eslint-disable-next-line import/no-unresolved
import { RANKING_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import RankingList from '../components/RankingList';
import LoadingScreen from './LoadingScreen';

export default function RankingScreen() {
  const [ranking, setRanking] = useState([]);
  const [isLoading, setLoading] = useState(true);

  async function downloadImage(imageURL) {
    const storage = getStorage();

    const imageRef = ref(storage, imageURL);
    const url = await getDownloadURL(imageRef);

    const filename = url.split('/').pop();
    const downloadDest = `${FileSystem.documentDirectory}${filename}`;

    const downloadResult = await FileSystem.downloadAsync(url, downloadDest);

    if (downloadResult.status !== 200) {
      console.error('Error downloading the image:', downloadResult);
      return null;
    }

    return downloadResult.uri;
  }

  async function fetchVisitRanking() {
    const lastUpdate = await AsyncStorage.getItem('last_update_ranking');
    const today = new Date();

    const lastUpdateDate = lastUpdate ? new Date(lastUpdate) : null;
    const isSameDay = lastUpdateDate && lastUpdateDate.getDate() === today.getDate()
                      && lastUpdateDate.getMonth() === today.getMonth()
                      && lastUpdateDate.getFullYear() === today.getFullYear();

    if (!isSameDay) {
      const url = RANKING_URL;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const rankingData = await response.json();
        const ImageDownloadRankingData = await Promise.all(
          rankingData.ranking.map(async (data) => {
            const localImageURL = await downloadImage(data.imageUrl);
            return {
              ...data,
              imageUrl: localImageURL,
            };
          }),
        );
        await AsyncStorage.setItem('rankingData', JSON.stringify(ImageDownloadRankingData));
        await AsyncStorage.setItem('last_update_ranking', today.toISOString());
        return ImageDownloadRankingData;
      } catch (error) {
        console.error('Fetch error:', error);
        return null;
      }
    } else {
      const cachedRanking = await AsyncStorage.getItem('rankingData');
      return cachedRanking ? JSON.parse(cachedRanking) : null;
    }
  }

  useEffect(() => {
    async function fetchAndSetRanking() {
      try {
        const rankingData = await fetchVisitRanking();
        if (rankingData) {
          setRanking(rankingData);
        } else {
          console.log('ランキングが空');
        }
        console.log('ランキング取得成功');
      } catch (e) {
        console.log('ランキング取得失敗', e);
      } finally {
        setLoading(false);
      }
    }

    fetchAndSetRanking();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.explainContainer}>
        <Text style={styles.explain}>3ヶ月来店回数ランキング</Text>
      </View>
      {isLoading ? <LoadingScreen /> : (
        <ScrollView>
          {ranking.map((rankingComponent, index) => (
            <View key={rankingComponent.name}>
              <RankingList
                rank={index + 1}
                imageUrl={rankingComponent.imageUrl}
                times={rankingComponent.visitCount}
                name={rankingComponent.name}
                title={rankingComponent.title}
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
  explainContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  explain: {
    fontSize: 25,
    color: 'orange',
    fontWeight: 'bold',
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
  subTitle: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  text: {
    fontSize: 20,
  },
});
