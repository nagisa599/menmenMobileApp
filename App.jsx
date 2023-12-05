import React, { useState, useEffect, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
// eslint-disable-next-line import/no-unresolved
import ENV from './env.json'; // eslint-disable-line
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
  GoogleAuthProvider, signInWithCredential, getAuth, onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import SignUpStack from './src/navigators/SignUpNavigator';
import GoogleSignUpStack from './src/navigators/GoogleSignUpNavigation';
import db from './firebaseConfig';
import AnimatedSplashScreen from './src/screens/AnimatedSplashScreen';
import userInfoContext from './src/utils/UserInfoContext';
import MainStackNavigator from './src/navigators/MainStackNavigator';
import LoadingScreen from './src/screens/LoadingScreen';
import { convertFirestoreTimestampToDate, formatDateToYYYYMMDD } from './src/utils/Data';
import { downloadUserImage } from './src/utils/DownloadImage';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [isSplashVisible, setSplashVisible] = useState(true); // 最初のロゴ画面を表示するかどうか
  const [isLoading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null); // ユーザ情報の監視
  const value = useMemo(() => ({ userInfo, setUserInfo }), [userInfo]); // useContextのためのvalue
  const auth = getAuth();
  // eslint-disable-next-line no-unused-vars
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: ENV.IOS_CLIENT_ID,
    androidClientId: ENV.ANDROID_CLIENT_ID,
  });
  // user情報が端末に保存されているかどうか(最初のページの判定)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userInfoDocRef = doc(db, `users/${user.uid}`);
          const userDoc = await getDoc(userInfoDocRef);
          if (userDoc.exists()) {
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
          } else { // これはいらない
            console.log('ユーザー情報ない');
          }
          setLoading(false);
        } catch (e) {
          setLoading(false);
        }
      } else {
        console.log('ユーザー未作成');
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  // }, [userInfo]);  //12月4日に除外

  useEffect(() => {
    // Googleアカウントでの認証に成功した場合
    if (response?.type === 'success') {
      console.log('Googleアカウントでの認証に成功');
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
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error('Error signing in with Google:', error);
          setLoading(false);
        });
    }
  }, [response]);

  if (isLoading) {
    return <LoadingScreen content="データ取得中" />;
  }
  if (userInfo) {
    if (!userInfo.name) {
      return (
        <userInfoContext.Provider value={value}>
          <NavigationContainer>
            <SignUpStack />
          </NavigationContainer>
        </userInfoContext.Provider>
      );
    }
    return (
      <userInfoContext.Provider value={value}>
        <NavigationContainer>
          <MainStackNavigator
            isSplashVisible={isSplashVisible}
            setSplashVisible={setSplashVisible}
          />
        </NavigationContainer>
      </userInfoContext.Provider>
    );
  }
  return (
    <userInfoContext.Provider value={value}>
      <NavigationContainer>
        {isSplashVisible
          ? (
            <AnimatedSplashScreen
              setSplashVisible={setSplashVisible}
            />
          ) : <GoogleSignUpStack promptAsync={promptAsync} />}
      </NavigationContainer>
    </userInfoContext.Provider>
  );
}
