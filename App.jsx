import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// eslint-disable-next-line import/no-unresolved
import { IOS_CLIENT_ID, ANDROID_CLIENT_ID } from '@env';
import CouponScreen from './src/screens/CouponScreen';
import FriendScreen from './src/screens/FriendScreen';
import getTabBarIcon from './src/components/FooterTab';
import MenuStack from './src/navigators/MenuNavigator';
import RankingStack from './src/navigators/RankingNavigator';
import SignUpStack from './src/navigators/SignUpNavigator';
import GoogleSingUppStack from './src/navigators/GoogleSingUpNavigation';
import MypageStack from './src/navigators/MypageNavigator';
import commonHeaderOptions from './src/styles/NavigationHeaderStyles';
// eslint-disable-next-line no-unused-vars
import db from './firebaseConfig';
/* eslint-disable */
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential,getAuth, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
/* eslint-able */

const Tab = createBottomTabNavigator();

WebBrowser.maybeCompleteAuthSession(); 
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
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="メニュー"
            screenOptions={{
              ...commonHeaderOptions,
              tabBarInactiveTintColor: 'black',
              tabBarActiveTintColor: 'tomato',
            }}
          >
            <Tab.Screen
              name="メニュー"
              component={MenuStack}
              options={{
                tabBarIcon: getTabBarIcon({ name: 'メニュー' }),
              }}
            />
            <Tab.Screen
              name="クーポン"
              component={CouponScreen}
              options={{
                tabBarIcon: getTabBarIcon({ name: 'クーポン' }),
              }}
            />
            <Tab.Screen
              name="ランキング"
              component={RankingStack}
              options={{
                tabBarIcon: getTabBarIcon({ name: 'ランキング' }),
              }}
            />
            <Tab.Screen
              name="フレンド"
              component={FriendScreen}
              options={{
                tabBarIcon: getTabBarIcon({ name: 'フレンド' }),
              }}
            />
            <Tab.Screen
              name="マイページ"
              component={MypageStack}
              options={{
                tabBarIcon: getTabBarIcon({ name: 'マイページ' }),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      );
    }
  } else {
    return (
      <NavigationContainer>
        <GoogleSingUppStack promptAsync={promptAsync} />
      </NavigationContainer>
    );
  }
}
