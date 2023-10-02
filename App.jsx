import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CouponScreen from './src/screens/CouponScreen';
import FriendScreen from './src/screens/FriendScreen';
import HomeScreen from './src/screens/HomeScreen';
import MypageScreen from './src/screens/MypageScreen';
import RankingScreen from './src/screens/RankingScreen';
import TitleScreen from './src/screens/TitleScreen';
import MenuScreen from './src/screens/MenuScreen';
import getTabBarIcon from './src/components/FooterTab';
import SettingScreen from './src/screens/SettingScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function RankingStack() {
  return (
    <Stack.Navigator initialRouteName="RankingScreen">
      <Stack.Screen name="RankingScreen" component={RankingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TitleScreen" component={TitleScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
function MenuStack() {
  return (
    <Stack.Navigator initialRouteName="MenuScreen">
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MenuScreen" component={MenuScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function MypageStack() {
  return (
    <Stack.Navigator initialRouteName="MypageScreen">
      <Stack.Screen name="MypageScreen" component={MypageScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SettingScreen" component={SettingScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Singup"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#C0C0C0',
            height: 120,
          },
          headerTitle: 'Men Men',
          headerTintColor: '#000000',
          headerBackTitle: 'Back',
          headerTitleStyle: {
            fontStyle: 'italic',
            fontSize: 35,
          },
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
