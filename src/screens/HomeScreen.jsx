import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection, query, where, getFirestore, getDocs, limit, orderBy,
} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import Calendar from '../components/Home/Calendar';

export default function HomeScreen() {
  const db = getFirestore();
  const navigation = useNavigation();
  const [url, seturl] = useState();
  const [urlDate, setUrlDate] = useState(new Date());
  const openGoogleForm = () => {
    Linking.openURL(url).catch((err) => console.error('URLを開けませんでした', err));
  };
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const displayMonthYear = `${currentYear}年${currentMonth}月`;

  const fetchGoogleFormUrl = async () => {
    const lastUpdate = await AsyncStorage.getItem('last_update_url');
    const lastUpdateDate = lastUpdate ? new Date(lastUpdate) : new Date(2010, 0, 1);
    const googleFormUrl = query(collection(db, 'googleFormUrl'), where('createdAt', '>', lastUpdateDate), orderBy('createdAt', 'desc'), limit(1));
    const urlDoc = await getDocs(googleFormUrl);
    const newUrlSnap = urlDoc.docs.map(async (doc) => {
      const data = doc.data();
      return {
        createdAt: data.createdAt.toDate(),
        url: data.url,
      };
    });
    const newUrl = await Promise.all(newUrlSnap);
    const cachedUrlString = await AsyncStorage.getItem('cashed_url');
    const cashedUrlDateString = await AsyncStorage.getItem('cashed_url_date');
    let cashedUrlDate = cashedUrlDateString ? new Date(cashedUrlDateString) : null;
    let cashedUrl = cachedUrlString ? JSON.parse(cachedUrlString) : null;
    if (newUrl.length) {
      cashedUrl = newUrl[0].url;// eslint-disable-line
      cashedUrlDate = newUrl[0].createdAt;// eslint-disable-line
    }
    seturl(cashedUrl);
    setUrlDate(cashedUrlDate);
    await AsyncStorage.setItem('cashed_url', JSON.stringify(cashedUrl));
    await AsyncStorage.setItem('last_update_url', new Date().toISOString());
    await AsyncStorage.setItem('cashed_url_date', cashedUrlDate.toISOString());
  };

  useEffect(() => {
    fetchGoogleFormUrl();
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleContainer}>
          <Entypo name="check" size={48} color="#000" />
          <Text style={styles.title}>アンケートのお願い</Text>
        </View>
        <View style={styles.explain}>
          <Text>新メニューやアプリについて簡単な</Text>
          <Text>アンケートの回答をお願いしております</Text>
          <Text>ぜひ皆様の意見を聞かせてください！！</Text>
          <Text style={styles.urlText}>{`⭐️${urlDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}から実施中⭐️`}</Text>
        </View>
        <TouchableOpacity
          style={styles.linkContainer}
          onPress={openGoogleForm}
        >
          <Text style={styles.linkText}>アンケートに回答する</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <View style={styles.titleContainer}>
          <Entypo name="check" size={48} color="#000" />
          <Text style={styles.title}>{`${displayMonthYear}カレンダー`}</Text>
        </View>
        <View style={styles.calendarContainer}>
          <Calendar />
        </View>
        <View style={styles.separator} />
        <View style={styles.titleContainer}>
          <Entypo name="check" size={48} color="#000" />
          <Text style={styles.title}>提供直前のコール</Text>
        </View>
        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.navigate('Message')}
        >
          <Text style={styles.linkText}>コールの確認はこちら！</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    paddingHorizontal: 40,
    paddingVertical: 30,
  },
  calendarContainer: {
    flex: 1,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  linkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 30,
    backgroundColor: 'orange',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 20,
    width: '80%',
    marginHorizontal: '10%',
  },
  linkText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: 'gray',
    marginVertical: 10,
  },
  titleContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  explain: {
    width: '80%',
    marginHorizontal: '10%',
    marginBottom: 20,
  },
  urlText: {
    color: 'red',
  },
});
