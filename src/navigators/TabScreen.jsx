import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import commonHeaderOptions from '../styles/NavigationHeaderStyles';

import MenuStack from './MenuNavigator';
import CouponScreen from '../screens/CouponScreen';
import RankingStack from './RankingNavigator';
import FriendListStack from './FriendNavigator';
import MypageStack from './MypageNavigator';
import getTabBarIcon from '../components/FooterTab';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
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
        component={FriendListStack}
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
  );
}
