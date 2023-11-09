import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MypageScreen from '../screens/MypageScreen';
import InquiryScreen from '../screens/InqueryScreen';
import TermsOfUseScreen from '../screens/TermsOfUseScreen';
import EditUserInfoScreen from '../screens/EditUserInfoScreen';

const Stack = createNativeStackNavigator();

export default function MypageStack() {
  return (
    <Stack.Navigator initialRouteName="MypageScreen">
      <Stack.Screen name="MypageScreen" component={MypageScreen} options={{ headerShown: false }} />
      <Stack.Screen name="InquiryScreen" component={InquiryScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TermsOfUseScreen" component={TermsOfUseScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditUserInfoScreen" component={EditUserInfoScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
