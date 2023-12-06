import React, { useState, useContext } from 'react';
import {
  View, Image, StyleSheet, TextInput, ScrollView, Text, Alert,
} from 'react-native';
import {
  getAuth,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import KeyboardSafeView from '../components/KeyBoradAvoidingView';
import logoImage from '../../assets/menmen-logo.png'; // ロゴ画像のパスを正しいものに置き換える
import Button from '../components/Button';
import validatePassword from '../utils/Validation';
import userInfoContext from '../utils/UserInfoContext';
/* eslint-disable*/
export default function EmailRegisterScreen({ route }) {
  const email = route.params.email;
 /* eslint-enable */
  const { setUserInfo } = useContext(userInfoContext);
  const [passwordErr, setPasswordErr] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();
  function registerPress() {
    if (!validatePassword(password)) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const { user } = userCredential;
          setUserInfo({
            uid: auth.currentUser.uid,
            email: user.email,
          });
        })
        .catch((e) => {
          console.log(e);
          Alert('ユーザ登録に失敗しました。');
        });
    } else {
      setPasswordErr(validatePassword(password));
    }
  }
  return (
    <ScrollView>
      <KeyboardSafeView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={logoImage} style={styles.logo} />
        </View>
        <View style={styles.errContainer}>
          <Text>新規登録のためにパスワードの登録をお願いします。</Text>
          <Text>※パスワードは8文字以上かつ数字、大文字、数字を1文字以上でお願いいたします。</Text>
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
            placeholder="登録パスワード"
            secureTextEntry
            textContentType="password"
          />
          <Button
            label="新規登録"
            onPress={() => registerPress()}
          />
        </View>
      </KeyboardSafeView>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
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
    marginTop: 80,
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
