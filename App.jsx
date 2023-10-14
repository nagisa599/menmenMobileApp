import React, { useState, useEffect, createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// eslint-disable-next-line import/no-unresolved
import { IOS_CLIENT_ID, ANDROID_CLIENT_ID } from '@env';
/* eslint-disable */
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential,getAuth, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpStack from './src/navigators/SignUpNavigator';
import GoogleSingUppStack from './src/navigators/GoogleSingUpNavigation';
import MainTabs from './src/navigators/TabScreen';
import db from './firebaseConfig';
import ComingCheckScreen from './src/screens/ComingCheckScreen';
import Generator from './src/components/Generator';
/* eslint-able */

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

WebBrowser.maybeCompleteAuthSession(); 
export const userInfoContext = createContext();

export default function App() {
  const auth = getAuth();
  const [userInfo, setUserInfo] = useState();
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
  });

  const checkLocalUser = async() => {
    try {
      const userJSON = await AsyncStorage.getItem("@user");
      const userData = userJSON ? JSON.parse(userJSON) : null;
      setUserInfo(userData);
    }catch(e) {
      alert(e.message);
    }
  }

  useEffect(() => {
    const saveUserToAsyncStorage = async (user) => {
      try {
        await AsyncStorage.setItem('@user', JSON.stringify(user));
      } catch (error) {
        console.error("Error saving user to AsyncStorage:", error);
      }
    };

    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((authResult) => {
          const user = authResult.user;
          saveUserToAsyncStorage(user);
          setUserInfo(user);
        })
        .catch((error) => {
          console.error("Error signing in with Google:", error);
        });
    } else {
    }
  }, [response]);

  useEffect(() => {
    const fetchData = async () => {
        await checkLocalUser();
    };
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const providerData = user.providerData;
        const isGoogleUser = providerData.some(data => data.providerId === 'google.com');

        if (!isGoogleUser) {
          Alert.alert('不正なログインです');
        }
      } else {
        Alert.alert('不正なログインです');
      }
    });

    fetchData();
    return () => unsub();
  }, []);

  if(userInfo) {
    if (!userInfo.name) {
      return (
        <NavigationContainer>
          <SignUpStack userInfo={userInfo} setUserInfo={setUserInfo} />
        </NavigationContainer>
      );
    } else {
      return (
        <userInfoContext.Provider value = {{userInfo,setUserInfo}} >
        <NavigationContainer>
          <Stack.Navigator initialRouteName='MainTabs'>
            <Stack.Screen name='MainTabs' component={MainTabs} options={{ headerShown: false }}  />
            <Stack.Screen name="ComingCheck" component={ComingCheckScreen} options={{ headerTitle: 'QRコード読み取り' }} />
            <Stack.Screen name="Generator" component={Generator} option={{ headerTitle: 'QRコード生成' }} />
          </Stack.Navigator>
        </NavigationContainer>
        </userInfoContext.Provider>
      );
    }
  } else {
    return (
      <NavigationContainer>
        <GoogleSingUppStack promptAsync={promptAsync} setUserInfo={setUserInfo}/>
      </NavigationContainer>
    );
  }
}
