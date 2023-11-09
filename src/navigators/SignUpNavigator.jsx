import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import SignUpScreen from '../screens/SignUpScreen';

const Stack = createNativeStackNavigator();

export default function SignUpStack() {
  return (
    <Stack.Navigator initialRouteName="SignUp">
      <Stack.Screen name="SignUp">
        {() => (
          <SignUpScreen />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
