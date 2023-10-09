import React, { useState, useEffect } from 'react';
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
// eslint-disable-next-line no-unused-vars
import db from './firebaseConfig';
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
      console.log('userData::', userData);
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
          console.log('User signed in:', user);
          saveUserToAsyncStorage(user);
          setUserInfo(user);
          console.log('user:', user);
        })
        .catch((error) => {
          console.error("Error signing in with Google:", error);
        });
    } else {
      console.log(response);
      console.log('userinfo:', userInfo);
      console.log('else');
    }
  }, [response]);

  useEffect(() => {
    const fetchData = async () => {
        await checkLocalUser();
    };

    fetchData();
}, []);

  // const handleAuthStateChanged = async (user) => {
  //   if (user) {
  //     const existingDataJSON = await AsyncStorage.getItem('@user');
  //     const existingData = existingDataJSON ? JSON.parse(existingDataJSON) : {};
  //     console.log('existingData:', existingData);
  
  //     if (!existingData.name) {
  //       await AsyncStorage.setItem('@user', JSON.stringify(user));
  //       setUserInfo(existingData);
  //     }
  //   } else {
  //     setUserInfo(existingData);
  //     console.log('else');
  //   }
  // };
  
  // useEffect(() => {
  //   const unsub = onAuthStateChanged(auth, handleAuthStateChanged);
  //   return () => unsub();
  // }, []);

//   useEffect(() => {
//     const saveUserInfoToAsyncStorage = async () => {
//       try {
//         await AsyncStorage.setItem('@user', JSON.stringify(userInfo));
//         console.log('User info saved to AsyncStorage');
//       } catch (error) {
//         console.error("Error saving user info to AsyncStorage:", error);
//       }
//     };

//     if (userInfo) {
//       saveUserInfoToAsyncStorage();
//     }
// }, [userInfo]);
  

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await checkLocalUser();
  //     console.log('userInfo:', userInfo);
  //     // checkLocalUser();
  //     // if (!userInfo.name) {
  //       const unsub = onAuthStateChanged(auth, async (user) => {
  //         if (!user.name) {
  //           console.log('user:', user);
  //           console.log('user.name:', user.name);
  //           // if (!user.name) {
  //           //   console.log('user前:', user);
  //           //   await AsyncStorage.setItem("@user", JSON.stringify(user));
  //           //   console.log('user後:', user);
  //           //   // setIsSignedUp(true);
  //           // }
  //         } else {
  //         }
  //       });
  //       return () => unsub();
  //     // }
  //   }

  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   checkLocalUser();
  //   console.log('userInfo:', userInfo);
  // }, []);

  const handleSignedUp = () => {
    // setUserInfo(userData);
  }

  if(userInfo) {
    if (!userInfo.name) {
      return (
        <NavigationContainer>
          <SignUpStack onSignedUp={handleSignedUp} userInfo={userInfo} setUserInfo={setUserInfo} />
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
