import React, { useState, useEffect, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
// eslint-disable-next-line import/no-unresolved
import { IOS_CLIENT_ID, ANDROID_CLIENT_ID } from '@env';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
  // eslint-disable-next-line no-unused-vars
  GoogleAuthProvider, signInWithCredential, getAuth, onAuthStateChanged,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpStack from './src/navigators/SignUpNavigator';
import GoogleSingUppStack from './src/navigators/GoogleSingUpNavigation';
import MainTabs from './src/navigators/TabScreen';
// eslint-disable-next-line no-unused-vars
import db from './firebaseConfig';
import ComingCheckScreen from './src/screens/ComingCheckScreen';
import Generator from './src/components/Generator';
import AnimatedSplashScreen from './src/screens/AnimatedSplashScreen';
import userInfoContext from './src/utils/UserInfoContext';

const Stack = createNativeStackNavigator();

WebBrowser.maybeCompleteAuthSession();
export default function App() {
  const [isSplashVisible, setSplashVisible] = useState(true);

  const auth = getAuth();
  const [userInfo, setUserInfo] = useState();
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
      const { idToken } = response.params;
      const credential = GoogleAuthProvider.credential(idToken);
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
    // const unsub = onAuthStateChanged(auth, async (user) => {
    //   if (user) {
    //     const { providerData } = user;
    //     const isGoogleUser = providerData.some((data) => data.providerId === 'google.com');

    //     if (!isGoogleUser) {
    //       Alert.alert('不正なログインです');
    //     }
    //   } else {
    //     Alert.alert('不正なログインです');
    //   }
    // });

    fetchData();
    // return () => unsub();
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
          {isSplashVisible
            ? (
              <AnimatedSplashScreen
                setSplashVisible={setSplashVisible}
              />
            ) : (
              <Stack.Navigator
                initialRouteName="MainTabs"
              >
                <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
                <Stack.Screen name="ComingCheck" component={ComingCheckScreen} options={{ headerTitle: 'QRコード読み取り' }} />
                <Stack.Screen name="Generator" component={Generator} option={{ headerTitle: 'QRコード生成' }} />
              </Stack.Navigator>
            )}
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
