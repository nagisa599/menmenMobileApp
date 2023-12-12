import React, { useState, useContext } from 'react';
import {
  View, StyleSheet, Text, TextInput, Image,
} from 'react-native';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import userInfoContext from '../utils/UserInfoContext';

import db from '../../firebaseConfig';
import logoImage from '../../assets/menmen-logo.png'; // ロゴ画像のパスを正しいものに置き換える
import Button from '../components/Button';
import LoadingScreen from './LoadingScreen';

/* eslint-disable */
export default function EmailLoginScreen({ route }) {
  const email = route.params.email;
  const [loading, setLoading] = useState(false);
  /* eslint-enable */
  const { setUserInfo } = useContext(userInfoContext);
  const auth = getAuth();
  const [passwordErr, setPasswordErr] = useState('');
  const [password, setPassword] = useState('');
  function loginPress() {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const { user } = userCredential;
        const userRef = doc(db, `users/${user.uid}`);
        const docSnap = await docSnap.getDoc(userRef);
        if (docSnap.exists()) {
          const exitUserData = docSnap.data();
          setUserInfo({
            name: exitUserData.name,
            birthday: exitUserData.birthday,
            ramen: exitUserData.ramen,
            topping: exitUserData.topping,
            createdAt: exitUserData.createdAt,
            updatedAt: exitUserData.updatedAt,
            times: exitUserData.times,
            visited: exitUserData.visited,
            imageUrl: exitUserData.imageUrl,
            title: exitUserData.title,
            friends: exitUserData.friends,
          });
        }
      })
      .catch(() => {
        setPasswordErr('登録したパスワードを入力してください');
      }).finally(() => {
        setLoading(false);
      });
  }
  if (loading) {
    return (
      <LoadingScreen content="認証中" />
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logoImage} style={styles.logo} />
      </View>
      <View style={styles.errContainer}>
        <Text>ログイン時に登録したパスワードの入力をお願いします</Text>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.errContainer}>
          <Text style={styles.errText}>{passwordErr}</Text>
        </View>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => { setPassword(text); }}
          autoCapitalize="none"
          placeholder="パスワード"
          secureTextEntry
          textContentType="password"
        />
        <Button
          label="ログイン"
          onPress={() => loginPress()}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f2f2f2', // 背景色を設定
  },
  logoContainer: {
    marginBottom: 40,
    paddingTop: 0,
  },
  logo: {
    width: 225, // ロゴ画像の幅を半分にする（元のサイズの半分）
    height: 225, // ロゴ画像の高さを半分にする（元のサイズの半分）
    borderRadius: 112.5, // 幅と高さの半分に設定することで円形になります
    marginTop: 20,
  },
  button: {
    padding: 30,
  },
  googleButton: {
    paddingTop: 0,
  },
  marginBottom: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#f2f2f2',
    paddingHorizontal: 10,
    width: 350,
    alignItems: 'center',
  },
  input: {
    fontSize: 16,
    height: 60,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    marginBottom: 16,
    borderRadius: 30,
    width: 350,
    paddingVertical: 10,
  },
  errText: {
    color: 'red',
  },
  errContainer: {
    width: '80%',
  },
});
