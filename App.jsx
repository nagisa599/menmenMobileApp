import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CouponScreen from './src/screens/CouponScreen';
import FriendScreen from './src/screens/FriendScreen';
import HomeScreen from './src/screens/HomeScreen';
import MypageScreen from './src/screens/MypageScree';
import RankingScreen from './src/screens/RankingScreen';
import TitleScreen from './src/screens/TitleScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function RankingStack() {
  return (
    <Stack.Navigator initialRouteName="TitleScreen">
      <Stack.Screen name="RankingScreen" component={RankingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TitleScreen" component={TitleScreen} options={{ headerShown: false }} />
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
          tabBarInactiveTintColor: 'black',
          tabBarActiveTintColor: 'tomato',
          headerTitleStyle: {
            fontStyle: 'italic',
            fontSize: 35,
          },
        }}
      >
        <Tab.Screen name="メニュー" component={HomeScreen} />
        <Tab.Screen name="クーポン" component={CouponScreen} />
        <Tab.Screen name="ランキング" component={RankingStack} />
        <Tab.Screen name="フレンド" component={FriendScreen} />
        <Tab.Screen name="マイページ" component={MypageScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
