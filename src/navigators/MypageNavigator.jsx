import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MypageScreen from '../screens/MypageScreen';
import SettingScreen from '../screens/SettingScreen';

const Stack = createNativeStackNavigator();

export default function MypageStack() {
  return (
    <Stack.Navigator initialRouteName="MypageScreen">
      <Stack.Screen name="MypageScreen" component={MypageScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SettingScreen" component={SettingScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
