import React, { useContext, useState } from 'react';
import {
  View, Image, StyleSheet, TextInput, ScrollView, Text,
} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { func } from 'prop-types';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import GoogleLoginButton from '../components/GoogleLoginButton';
import AppleLoginButton from '../components/AppleLoginButton';
import NotLoginButton from '../components/NotLoginButton';
import KeyboardSafeView from '../components/KeyBoradAvoidingView';
import validatePassword from '../utils/Validation';
import logoImage from '../../assets/menmen-logo.png'; // ロゴ画像のパスを正しいものに置き換える
import Button from '../components/Button';
import userInfoContext from '../utils/UserInfoContext';

export default function GoogleLoginScreen(props) {
  const { promptAsync } = props;
  const { setUserInfo } = useContext(userInfoContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const auth = getAuth();

  // メールアドレスとパスワードでアカウント作成した場合
  function handlePress() {
    if (!validatePassword(password)) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const { user } = userCredential;
          setUserInfo({
            uid: auth.currentUser.uid,
            email: user.email,
          });
        })
        .catch(() => {
          setEmailErr('正しいメールアドレスを入力してください');
        });
    } else {
      setPasswordErr(validatePassword(password));
    }
  }
  function notLogin() {
    const user = {
      name: 'notLogin',
    };
    setUserInfo(user);
  }
  return (
    <ScrollView>
      <KeyboardSafeView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={logoImage} style={styles.logo} />
        </View>
        <View style={styles.googleButton}>
          <GoogleLoginButton onPress={() => promptAsync()} />
        </View>
        <View style={styles.button}>
          <AppleLoginButton onPress={() => promptAsync()} />
        </View>
        <View style={styles.marginBottom}>
          <NotLoginButton onPress={() => notLogin()} />
        </View>
        <View style={styles.errContainer}>
          <Text>※パスワードは8文字以上かつ数字、大文字、数字を1文字以上でお願いいたします。</Text>
          <Text style={styles.errText}>{emailErr}</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => { setEmail(text); }}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="メールアドレス"
            textContentType="emailAddress"
          />
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
            label="ログイン（新規登録）"
            onPress={() => handlePress()}
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

GoogleLoginScreen.propTypes = {
  promptAsync: func.isRequired,
};
