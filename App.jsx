import React, { useState, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
// eslint-disable-next-line import/no-unresolved
import SignUpStack from './src/navigators/SignUpNavigator';
import GoogleSignUpStack from './src/navigators/GoogleSignUpNavigation';
import AnimatedSplashScreen from './src/screens/AnimatedSplashScreen';
import userInfoContext from './src/utils/UserInfoContext';
import MainStackNavigator from './src/navigators/MainStackNavigator';
/*eslint-disable*/
import LoadingScreen from './src/screens/LoadingScreen';


export default function App() {
  const [isSplashVisible, setSplashVisible] = useState(true); // 最初のロゴ画面を表示するかどうか
  const [isLoading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null); // ユーザ情報の監視
  const value = useMemo(() => ({ userInfo, setUserInfo }), [userInfo]); // useContextのためのvalue

  // if (isLoading) {
  //   return <LoadingScreen content="データ取得中" />;
  // }
  
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
          ) : <GoogleSignUpStack />}
      </NavigationContainer>
    </userInfoContext.Provider>
  );
}
