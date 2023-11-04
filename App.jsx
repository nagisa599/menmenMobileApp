import React, { useState, useEffect, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
// eslint-disable-next-line import/no-unresolved
import { IOS_CLIENT_ID, ANDROID_CLIENT_ID } from '@env';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
  GoogleAuthProvider, signInWithCredential, getAuth, onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';
import SignUpStack from './src/navigators/SignUpNavigator';
import GoogleSingUppStack from './src/navigators/GoogleSingUpNavigation';
import db from './firebaseConfig';
import AnimatedSplashScreen from './src/screens/AnimatedSplashScreen';
import userInfoContext from './src/utils/UserInfoContext';
import MainStackNavigator from './src/navigators/MainStackNavigator';
import LoadingScreen from './src/screens/LoadingScreen';
import { ChangeIDtoName } from './src/utils/Data';

WebBrowser.maybeCompleteAuthSession();
export default function App() {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const value = useMemo(() => ({ userInfo, setUserInfo }), [userInfo]);

  const auth = getAuth();
  const storage = getStorage();
  // eslint-disable-next-line no-unused-vars
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
  });

  async function downloadImage(imageURL) {
    const imageRef = ref(storage, imageURL);
    const url = await getDownloadURL(imageRef);

    const filename = url.split('/').pop();
    const downloadDest = `${FileSystem.documentDirectory}${filename}`;

    const downloadResult = await FileSystem.downloadAsync(url, downloadDest);

    if (downloadResult.status !== 200) {
      console.error('Error downloading the image:', downloadResult);
      return null;
    }

    return downloadResult.uri;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userInfoDocRef = doc(db, `users/${user.uid}`);
        try {
          const userDoc = await getDoc(userInfoDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.imageUrl) {
              const downloadImageUrl = await downloadImage(userData.imageUrl);
              userData.imageUrl = downloadImageUrl;
            }

            const ramenName = await ChangeIDtoName(userData.ramen);
            const toppingName = await ChangeIDtoName(userData.topping);
            // let lastVisitDate = null;
            // let comingData = [];

            // if (userData.times && userData.times.length > 0) {
            // lastVisitDate = userData.times[userData.times.length - 1];
            // lastVisitDate = convertFirestoreTimestampToDate(lastVisitDate);
            // lastVisitDate = formatDateToYYYYMMDD(lastVisitDate);
            //   comingData = userData.times;
            // }

            // const today = formatDateToYYYYMMDD(new Date());

            // if (lastVisitDate === today) {
            //   setVisited(true);
            // } else {
            //   setVisited(false);
            // }

            // const formattedDates = comingData.map((data) => {
            //   const date = convertFirestoreTimestampToDate(data);
            //   return formatDateToYYYYMMDD(date);
            // });

            setUserInfo({
              ...userInfo,
              uid: auth.currentUser.uid,
              email: userData.email,
              name: userData.name,
              ramen: ramenName,
              topping: toppingName,
              visited: userData.visited,
              imageUrl: userData.imageUrl,
              title: userData.title,
              birthday: userData.birthday,
              createdAt: userData.createdAt,
              updatedAt: userData.updatedAt,
              times: userData.times,
            });
          } else {
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

  useEffect(() => {
  }, [userInfo]);

  useEffect(() => {
    // Googleアカウントでの認証に成功した場合
    if (response?.type === 'success') {
      setLoading(true);
      /* eslint-disable */
      const { id_token } = response.params;
      /* eslint-enable */
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((authResult) => {
          const { user } = authResult;
          const userRef = doc(db, `users/${user.uid}`);
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
        })
        .catch((error) => {
          console.error('Error signing in with Google:', error);
          setLoading(false);
        });
    }
  }, [response]);

  if (isLoading) {
    return <LoadingScreen />;
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
          ) : <GoogleSingUppStack promptAsync={promptAsync} />}
      </NavigationContainer>
    </userInfoContext.Provider>
  );
}
