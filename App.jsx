import React, { useState, useEffect } from 'react';
import { getApp, initializeApp } from 'firebase/app';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CouponScreen from './src/screens/CouponScreen';
import FriendScreen from './src/screens/FriendScreen';
import getTabBarIcon from './src/components/FooterTab';
import MenuStack from './src/navigators/MenuNavigator';
import RankingStack from './src/navigators/RankingNavigator';
import SignUpStack from './src/navigators/SignUpNavigator';
import GoogleSingUppStack from './src/navigators/GoogleSingUpNavigation';
import MypageStack from './src/navigators/MypageNavigator';
import commonHeaderOptions from './src/styles/NavigationHeaderStyles';
import { firebaseConfig } from './env';
/* eslint-disable */
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential,getAuth, initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GoogleLoginScreen from './src/screens/GoogleLoginScreen';
/* eslint-able */

const Tab = createBottomTabNavigator();

WebBrowser.maybeCompleteAuthSession(); 
export default function App() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '768644207627-jt4cfhrnmoei12nol1fkm4c5kfqcq17i.apps.googleusercontent.com',
    androidClientId: '768644207627-mldrc5c1tvd4noucmfrhopdc5r633kpa.apps.googleusercontent.com',
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
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);
  useEffect(() => {
    checkLocalUser();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(JSON.stringify(user, null, 2));
        setUserInfo(user);
        await AsyncStorage.setItem("@user", JSON.stringify(user));
      } else {
        console.log('else');
      }
    });
    return () => unsub();
  }, []);

  const handleSignedUp = () => {
    setIsSignedUp(true);
  };
  if(userInfo) {
  if (!isSignedUp) {
    return (
      <NavigationContainer>
        <SignUpStack onSignedUp={handleSignedUp} />
      </NavigationContainer>
    );
  }
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
} else{
  return (
    <NavigationContainer>
      <GoogleSingUppStack promptAsync={promptAsync} />
    </NavigationContainer>
  );
}
}
