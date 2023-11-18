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
import GoogleSignUpStack from './src/navigators/GoogleSignUpNavigation';
import db from './firebaseConfig';
import AnimatedSplashScreen from './src/screens/AnimatedSplashScreen';
import userInfoContext from './src/utils/UserInfoContext';
import MainStackNavigator from './src/navigators/MainStackNavigator';
import LoadingScreen from './src/screens/LoadingScreen';
import { convertFirestoreTimestampToDate, formatDateToYYYYMMDD } from './src/utils/Data';
import createImagesDirectory from './src/utils/createImagesDirectory';

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

    // const filename = url.split('/').pop();

    await createImagesDirectory('user');
    const relativePath = `user/${auth.currentUser.uid}`;
    const downloadDest = `${FileSystem.documentDirectory}${relativePath}`;

    const downloadResult = await FileSystem.downloadAsync(url, downloadDest);

    if (downloadResult.status !== 200) {
      console.error('Error downloading the image:', downloadResult);
      return null;
    }

    return relativePath;
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
              friend: userData.friend,
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
          ) : <GoogleSignUpStack promptAsync={promptAsync} />}
      </NavigationContainer>
    </userInfoContext.Provider>
  );
}
