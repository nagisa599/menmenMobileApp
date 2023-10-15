import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import FriendListScreen from '../screens/FriendListScreen';
import FriendDetailScreen from '../screens/FriendDetailScreen';
import FriendAddScreen from '../screens/FriendAddScreen';
import FriendSearchScreen from '../screens/FriendSearchScreen';
import BookOfTicketScreen from '../screens/BookOfTicketScreen';

const Stack = createNativeStackNavigator();

export default function FriendListStack() {
  return (
    <Stack.Navigator initialRouteName="MenuScreen">
      <Stack.Screen name="FriendListScreen" component={FriendListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FriendDetailScreen" component={FriendDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FriendAddScreen" component={FriendAddScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FriendSearchScreen" component={FriendSearchScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BookOfTicketScreen" component={BookOfTicketScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
