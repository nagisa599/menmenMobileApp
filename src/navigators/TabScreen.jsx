import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MenuScreen from '../screens/MenuScreen';
import FriendListStack from './FriendNavigator';
import CouponScreen from '../screens/CouponScreen';
import getTabBarIcon from '../components/FooterTab';
import HomeStack from './HomeNavigator';
import RankingScreen from '../screens/RankingScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="ホーム"
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: 'black',
        tabBarActiveTintColor: 'orange',
      }}
    >
      <Tab.Screen
        name="ホーム"
        component={HomeStack}
        options={{
          tabBarIcon: getTabBarIcon({ name: 'ホーム' }),
        }}
      />
      <Tab.Screen
        name="メニュー"
        component={MenuScreen}
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
        component={RankingScreen}
        options={{
          tabBarIcon: getTabBarIcon({ name: 'ランキング' }),
        }}
      />
      <Tab.Screen
        name="フレンド"
        component={FriendListStack}
        options={{
          tabBarIcon: getTabBarIcon({ name: 'フレンド' }),
        }}
      />
    </Tab.Navigator>
  );
}
