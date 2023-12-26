import React, { useContext, useState, useEffect } from 'react';
import {
  View, Image, StyleSheet, TextInput, ScrollView, Text, Alert,
} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { func } from 'prop-types';
import * as Google from 'expo-auth-session/providers/google';
import * as Crypto from 'expo-crypto';
import { doc, getDoc, setDoc } from 'firebase/firestore';
// eslint-disable-next-line
import * as AppleAuthentication from 'expo-apple-authentication';
// eslint-disable-next-line
import { AppleButton } from '@invertase/react-native-apple-authentication';
import {
  getAuth,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import GoogleLoginButton from '../components/Login/GoogleLoginButton';
import AppleLoginButton from '../components/Login/AppleLoginButton';
import NotLoginButton from '../components/Login/NotLoginButton';
import LoadingScreen from './LoadingScreen';
import KeyboardSafeView from '../components/KeyBoradAvoidingView';
import logoImage from '../../assets/menmen-logo.png'; // ロゴ画像のパスを正しいものに置き換える
import userInfoContext from '../utils/UserInfoContext';
import Button from '../components/Button';
import db from '../../firebaseConfig';
import ENV from '../../env.json';
import { convertFirestoreTimestampToDate, formatDateToYYYYMMDD } from '../utils/Data';
import { downloadUserImage } from '../utils/DownloadImage';

WebBrowser.maybeCompleteAuthSession();
export default function GoogleLoginScreen(props) {
  const { navigation } = props;
  const { setUserInfo, userInfo } = useContext(userInfoContext);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [emailErr, setEmailErr] = useState('');
  const auth = getAuth();
  function nonceGen(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  // eslint-disable-next-line no-unused-vars
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: ENV.IOS_CLIENT_ID,
    androidClientId: ENV.ANDROID_CLIENT_ID,
  });
  // emailを送信するための設定
  const actionCodeSettings = {
    url: 'https://example.co.jp/',
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
        navigation.navigate('EmailLogin', { email });
      } else {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings).then(() => {
          console.log(email);
          navigation.navigate('EmailRegister', { email });
          Alert.alert('メールを送信しました。メールのリンクをクリックしてください');
        })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            setEmailErr('ただしいメールアドレスを入力してください');
          });
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
  }
  // ログインしていない場合
  function notLogin() {
    const user = {
      name: 'notLogin',
    };
    setUserInfo(user);
  }
  async function appleLogin() {
    try {
      const nonce = nonceGen(32); // ランダム文字列（ノンス）を生成
      const digestedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        nonce,
      ); // SHA256でノンスをハッシュ化
      const result = await AppleAuthentication.signInAsync({
        requestedScopes: [ // ユーザー情報のスコープを設定（名前とメールアドレスのみ可）
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: digestedNonce, // Apple側にはハッシュ化したノンスを渡す
      });
      const provider = new OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: result.identityToken,
        rawNonce: nonce, // Firebase側には元のノンスを渡して検証させる
      });
      signInWithCredential(auth, credential)
        .then(async (authResult) => {
          const userRef = doc(db, `users/${authResult.user.uid}`);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const exitUserData = docSnap.data();
            // console.log(exitUserData);
            console.log('Appleユーザー登録済み');
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
          } else {
            setDoc(userRef, {
              email: authResult.user.email,
              uid: authResult.user.uid,
            }, { merge: true })
              .then(() => {
                console.log('Appleユーザー登録成功');
              })
              .catch((error) => {
                console.error('Appleユーザー登録:', error);
              });
            setUserInfo({
              ...userInfo,
              email: authResult.user.email,
              uid: authResult.user.uid,
            });
          }
        })
        .catch((error) => {
          console.error('Error signing in with Google:', error);
        })
        .finally(() => {
          setLoading(false);
        });
      // console.log(credential);
    } catch (e) {
      if (e.code === 'ERR_REQUEST_CANCELED') {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  }
  // user情報が端末に保存されているかどうか(最初のページの判定)
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userInfoDocRef = doc(db, `users/${user.uid}`);
          const userDoc = await getDoc(userInfoDocRef);
          const userData = userDoc.data();
          if (userData.imageUrl) { //
            const downloadImageUrl = await downloadUserImage(userData.imageUrl);
            userData.imageUrl = downloadImageUrl;
          }
          let lastVisitDate = null;
          if (userData.times && userData.times.length > 0) {
            lastVisitDate = userData.times[userData.times.length - 1];
            lastVisitDate = convertFirestoreTimestampToDate(lastVisitDate);
            lastVisitDate = formatDateToYYYYMMDD(lastVisitDate);
          }
          const today = formatDateToYYYYMMDD(new Date());
          setUserInfo({
            ...userInfo,
            uid: auth.currentUser.uid,
            email: userData.email,
            name: userData.name,
            ramen: userData.ramen,
            topping: userData.topping,
            visited: lastVisitDate === today,
            imageUrl: userData.imageUrl,
            title: userData.title,
            birthday: userData.birthday,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
            times: userData.times,
            friends: userData.friends,
          });
        } catch (e) {
          Alert('ユーザ情報の取得に失敗しました。');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    setLoading(true);
    // Googleアカウントでの認証に成功した場合
    if (response?.type === 'success') {
      console.log('Googleアカウントでの認証に成功');
      console.log(response);
      /* eslint-disable */
      const { id_token } = response.params;
      /* eslint-enable */
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(async (authResult) => {
          const { user } = authResult;
          const userRef = doc(db, `users/${user.uid}`);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const exitUserData = docSnap.data();
            console.log(exitUserData);
            console.log('googleユーザー登録済み');
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
          } else {
            setDoc(userRef, {
              email: user.email,
              uid: user.uid,
            }, { merge: true })
              .then(() => {
                console.log('googleユーザー登録成功');
              })
              .catch((error) => {
                console.error('error googleユーザー登録:', error);
              });
            setUserInfo({
              ...userInfo,
              email: user.email,
              uid: auth.currentUser.uid,
            });
          }
        })
        .catch((error) => {
          console.error('Error signing in with Google:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [response]);

  if (loading) {
    return <LoadingScreen content="認証中" />;
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
          <AppleLoginButton onPress={() => appleLogin()} />
        </View>
        <View style={styles.marginBottom}>
          <NotLoginButton onPress={() => notLogin()} />
        </View>
        <View style={styles.errContainer}>
          <Text>※emailアドレスを入力をお願いします。</Text>
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
