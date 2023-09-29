import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CouponScreen from './src/screens/CouponScreen';
import FriendScreen from './src/screens/FriendScreen';
import HomeScreen from './src/screens/HomeScreen';
import MypageScreen from './src/screens/MypageScree';
import RankingScreen from './src/screens/RankingScreen';

export default function App() {
  const Tab = createBottomTabNavigator();
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Singup"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#C0C0C0',
          },
          headerTitle: 'MenMen',
          headerTintColor: '#000000',
          headerBackTitle: 'back',
          tabBarInactiveTintColor: 'black',
          tabBarActiveTintColor: 'tomato',
          headerTitleStyle: {
            fontStyle: 'italic',
            fontSize: 40,
          },
        }}
      >
        <Tab.Screen name="メニュー" component={HomeScreen} />
        <Tab.Screen name="クーポン" component={CouponScreen} />
        <Tab.Screen name="ランキング" component={RankingScreen} />
        <Tab.Screen name="フレンド" component={FriendScreen} />
        <Tab.Screen name="マイページ" component={MypageScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
