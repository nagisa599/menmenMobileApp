/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Linking,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  query, where, collection, getFirestore, orderBy, limit, getDocs,
} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import CircleComponent from '../components/Home/CircleComponent';
import Calendar from '../components/Home/Calendar';

export default function HomeScreen2() {
  const navigation = useNavigation();
  const [url, seturl] = useState();
  const [calendarModal, setCalendarModal] = useState(false);
  const [urlDate, setUrlDate] = useState(new Date());

  const openGoogleForm = () => {
    Linking.openURL(url).catch((err) => console.error('URLを開けませんでした', err));
  };

  const fetchGoogleFormUrl = async () => {
    const lastUpdate = await AsyncStorage.getItem('last_update_url');
    const lastUpdateDate = lastUpdate ? new Date(lastUpdate) : new Date(2010, 0, 1);
    const googleFormUrl = query(collection(getFirestore(), 'googleFormUrl'), where('createdAt', '>', lastUpdateDate), orderBy('createdAt', 'desc'), limit(1));
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

  // const changeModal = () => {
  //   setCalendarModal(!calendarModal);
  // };

  const openTwitter = () => {
    const twitterURL = 'https://twitter.com/yama_rock_80000';

    Linking.canOpenURL(twitterURL).then((supported) => {
      if (supported) {
        Linking.openURL(twitterURL);
      } else {
        console.log(`Don't know how to open URI: ${twitterURL}`);
      }
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <Image source={require('../../assets/山岡士郎.png')} style={styles.mainImage} />
        </View>
        <View style={styles.bodyContainer}>
          <CircleComponent text="アンケート" onPress={openGoogleForm} iconName="question-circle-o" />
          <CircleComponent text="営業時間" onPress={() => navigation.navigate('Calendar')} iconName="calendar" />
          {/* <Modal
            animationType="slide"
            transparent={false}
            visible={calendarModal}
            onRequestClose={() => {
              setCalendarModal(!calendarModal);
            }}
          >
            <View style={styles.calendarView}>
              <Calendar />
            </View>
          </Modal> */}
          <CircleComponent text="コール" onPress={() => navigation.navigate('Message')}  />
          <CircleComponent text="Twitter" onPress={openTwitter} />
        </View>
      </View>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  mainImage: {
    width: 'auto',
    height: 200,
    margin: 15,
  },
  bodyContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  calendarView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
