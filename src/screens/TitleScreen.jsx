import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, Text, Alert,
} from 'react-native';
import {
  getFirestore, getDoc, doc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Tab from '../components/Tab';
import CircleTitle from '../components/CircleTitle';

export default function TitleScreen(props) {
  const { navigation } = props;
  const [title, setTitle] = useState(0);
  const setTitleImage = async () => {
    try {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;
      const ref = doc(db, `users/${user.uid}/`);
      const docSnap = await getDoc(ref);
      const myTimes = docSnap.data().times.length;
      setTitle(myTimes);
    } catch (error) {
      Alert.alert('データの読み込みに失敗しました');
    }
  };
  useEffect(() => {
    setTitleImage();
  }, []);
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
        <CircleTitle title={title} />
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
    fontSize: 40,
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
    fontSize: 40,
  },
});
