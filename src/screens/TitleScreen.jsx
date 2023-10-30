import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
  getFirestore, getDoc, doc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import CircleTitle from '../components/CircleTitle';

export default function TitleScreen() {
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
      <CircleTitle title={title} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
});
