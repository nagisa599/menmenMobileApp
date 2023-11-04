import React, { useState, useEffect, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
// eslint-disable-next-line import/no-unresolved
import { IOS_CLIENT_ID, ANDROID_CLIENT_ID } from '@env';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
  GoogleAuthProvider, signInWithCredential, getAuth,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignUpStack from './src/navigators/SignUpNavigator';
import GoogleSingUppStack from './src/navigators/GoogleSingUpNavigation';
// eslint-disable-next-line no-unused-vars
import db from './firebaseConfig';
import AnimatedSplashScreen from './src/screens/AnimatedSplashScreen';
import userInfoContext from './src/utils/UserInfoContext';
import MainStackNavigator from './src/navigators/MainStackNavigator';

WebBrowser.maybeCompleteAuthSession();
export default function App() {
  const [isSplashVisible, setSplashVisible] = useState(true);

  const auth = getAuth();
  const [userInfo, setUserInfo] = useState(null);
  const value = useMemo(() => ({ userInfo, setUserInfo }), [userInfo]);
  // eslint-disable-next-line no-unused-vars
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
  });

  const checkLocalUser = async () => {
    try {
      const userJSON = await AsyncStorage.getItem('@user');
      const userData = userJSON ? JSON.parse(userJSON) : null;
      setUserInfo(userData);
    } catch (e) {
      alert(e.message);
    }
  };

  useEffect(() => {
    const saveUserToAsyncStorage = async (user) => {
      try {
        await AsyncStorage.setItem('@user', JSON.stringify(user));
      } catch (error) {
        console.error('Error saving user to AsyncStorage:', error);
      }
    };

    if (response?.type === 'success') {
      /* eslint-disable */
      const { id_token } = response.params;
      /* eslint-enable */
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((authResult) => {
          const { user } = authResult;
          saveUserToAsyncStorage(user);
          setUserInfo(user);
        })
        .catch((error) => {
          console.error('Error signing in with Google:', error);
        });
    }
  }, [response]);

  useEffect(() => {
    const fetchData = async () => {
      await checkLocalUser();
    };

    fetchData();
  }, []);

  if (userInfo) {
    if (!userInfo.name) {
      return (
        <NavigationContainer>
          <SignUpStack userInfo={userInfo} setUserInfo={setUserInfo} />
        </NavigationContainer>
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
    <NavigationContainer>
      {isSplashVisible
        ? (
          <AnimatedSplashScreen
            setSplashVisible={setSplashVisible}
          />
        ) : <GoogleSingUppStack promptAsync={promptAsync} setUserInfo={setUserInfo} />}
    </NavigationContainer>
  );
}
