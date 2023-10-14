import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import FriendListScreen from '../screens/FriendListScreen';
import BookOfTicketScreen from '../screens/BookOfTicketScreen';

const Stack = createNativeStackNavigator();

export default function MenuStack() {
  return (
    <Stack.Navigator initialRouteName="MenuScreen">
      <Stack.Screen name="FriendListScreen" component={FriendListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BookOfTicketScreen" component={BookOfTicketScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
