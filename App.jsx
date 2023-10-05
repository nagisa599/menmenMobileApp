import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CouponScreen from './src/screens/CouponScreen';
import FriendScreen from './src/screens/FriendScreen';
import getTabBarIcon from './src/components/FooterTab';
import MenuStack from './src/navigators/MenuNavigator';
import RankingStack from './src/navigators/RankingNavigator';
import SignUpStack from './src/navigators/SignUpNavigator';
import MypageStack from './src/navigators/MypageNavigator';
import commonHeaderOptions from './src/styles/NavigationHeaderStyles';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isSignedUp, setIsSignedUp] = useState(false);

  const handleSignedUp = () => {
    setIsSignedUp(true);
  };

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
}
