import React, { useContext, useState } from 'react';
import {
  View, Image, StyleSheet, TextInput, ScrollView, Text, Alert,
} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { func } from 'prop-types';
import { doc, getDoc } from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
} from 'firebase/auth';

import GoogleLoginButton from '../components/GoogleLoginButton';
import AppleLoginButton from '../components/AppleLoginButton';
import NotLoginButton from '../components/NotLoginButton';
import KeyboardSafeView from '../components/KeyBoradAvoidingView';
import validatePassword from '../utils/Validation';
import logoImage from '../../assets/menmen-logo.png'; // ロゴ画像のパスを正しいものに置き換える
import Button from '../components/Button';
import userInfoContext from '../utils/UserInfoContext';
import db from '../../firebaseConfig';

export default function GoogleLoginScreen(props) {
  const { promptAsync } = props;
  const { setUserInfo } = useContext(userInfoContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [LoginOption, setLoginOption] = useState('');
  const auth = getAuth();
  // emailを送信するための設定
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'https://example.co.jp/',
    // This must be true.
    handleCodeInApp: true,
    iOS: {
      bundleId: 'com.example.ios',
    },
    android: {
      packageName: 'com.example.android',
      installApp: true,
      minimumVersion: '12',
    },
    dynamicLinkDomain: 'menmensingup.page.link',
  };

  // メールアドレスとパスワードでアカウント作成した場合
  async function handlePress() {
    try {
      const emailRef = doc(db, `email/${email}`);
      const userSnap = await getDoc(emailRef);
      if (userSnap.exists()) {
        setLoginOption('email-login');
      } else {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings).then(() => {
          console.log(email);
          setLoginOption('email-signup');
          Alert.alert('メールを送信しました。メールのリンクをクリックしてください');
        })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
          });
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
  }
  function loginPress() {
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
      });
  }

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
  if (LoginOption === 'email-login') {
    return (
      <ScrollView>
        <KeyboardSafeView style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={logoImage} style={styles.logo} />
          </View>
          <View style={styles.errContainer}>
            <Text>ログイン時に登録したパスワードの入力をお願いします</Text>
            <Text style={styles.errText}>{emailErr}</Text>
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
        </KeyboardSafeView>
      </ScrollView>
    );
  }
  if (LoginOption === 'email-signup') {
    return (
      <ScrollView>
        <KeyboardSafeView style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={logoImage} style={styles.logo} />
          </View>
          <View style={styles.errContainer}>
            <Text>新規登録のためにパスワードの登録をお願いします。</Text>
            <Text>※パスワードは8文字以上かつ数字、大文字、数字を1文字以上でお願いいたします。</Text>
            <Text style={styles.errText}>{emailErr}</Text>
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
          {/* <TextInput
            style={styles.input}
            value={password}
            onChangeText={(text) => { setPassword(text); }}
            autoCapitalize="none"
            placeholder="パスワード"
            secureTextEntry
            textContentType="password"
          /> */}
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

GoogleLoginScreen.propTypes = {
  promptAsync: func.isRequired,
};
