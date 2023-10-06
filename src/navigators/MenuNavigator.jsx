import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/MenuScreen';

const Stack = createNativeStackNavigator();

export default function MenuStack() {
  return (
    <Stack.Navigator initialRouteName="MenuScreen">
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MenuScreen" component={MenuScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}