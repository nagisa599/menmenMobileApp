import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { func } from 'prop-types';

import commonHeaderOptions from '../styles/NavigationHeaderStyles';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createNativeStackNavigator();

export default function SignUpStack({ onSignedUp }) {
  return (
    <Stack.Navigator initialRouteName="SignUp" screenOptions={commonHeaderOptions}>
      <Stack.Screen name="SignUp">
        {() => <SignUpScreen onSignedUp={onSignedUp} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

SignUpStack.propTypes = {
  onSignedUp: func.isRequired,
};
