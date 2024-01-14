import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
// import HomeScreen from '../screens/HomeScreen';
import HomeScreen2 from '../screens/HomeScreen2';
// import Message from '../components/Message';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen2">
      <Stack.Screen name="HomeScreen2" component={HomeScreen2} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
