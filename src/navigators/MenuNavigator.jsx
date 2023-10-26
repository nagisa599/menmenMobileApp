import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MenuScreen from '../screens/MenuScreen';
import LimitMenuScreen from '../screens/LimitMenuScreen';

const Stack = createNativeStackNavigator();

export default function MenuStack() {
  return (
    <Stack.Navigator initialRouteName="MenuScreen">
      <Stack.Screen name="MenuScreen" component={MenuScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LimitMenuScreen" component={LimitMenuScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
