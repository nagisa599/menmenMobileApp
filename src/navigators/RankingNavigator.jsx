import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import RankingScreen from '../screens/RankingScreen';
import TitleScreen from '../screens/TitleScreen';

const Stack = createNativeStackNavigator();

export default function RankingStack() {
  return (
    <Stack.Navigator initialRouteName="RankingScreen">
      <Stack.Screen name="RankingScreen" component={RankingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TitleScreen" component={TitleScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
