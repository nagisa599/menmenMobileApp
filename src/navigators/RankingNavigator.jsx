import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import RankingScreen from '../screens/RankingScreen';

const Stack = createNativeStackNavigator();

export default function RankingStack() {
  return (
    <Stack.Navigator initialRouteName="RankingScreen">
      <Stack.Screen name="RankingScreen" component={RankingScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
