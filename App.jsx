import React, { useState, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
// eslint-disable-next-line import/no-unresolved
import GoogleSignUpStack from './src/navigators/GoogleSignUpNavigation';
import AnimatedSplashScreen from './src/screens/AnimatedSplashScreen';
import userInfoContext from './src/utils/UserInfoContext';
import MainStackNavigator from './src/navigators/MainStackNavigator';
import SignUpScreen from './src/screens/SignUpScreen';
/*eslint-disable*/


export default function App() {
  const [isSplashVisible, setSplashVisible] = useState(true); // 最初のロゴ画面を表示するかどうか
  const [userInfo, setUserInfo] = useState(null); // ユーザ情報の監視
  const value = useMemo(() => ({ userInfo, setUserInfo}), [userInfo]); // useContextのためのvalue
  if (userInfo) {
      return (
        <userInfoContext.Provider value={value}>
        {!userInfo.name ?( 
          <SignUpScreen />
        ) : (
          <NavigationContainer>
            <MainStackNavigator
              isSplashVisible={isSplashVisible}
              setSplashVisible={setSplashVisible}
            />
          </NavigationContainer>
        )}
        </userInfoContext.Provider>
      );
  }
  //userが存在しない場合
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
