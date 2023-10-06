import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { func } from 'prop-types';

import commonHeaderOptions from '../styles/NavigationHeaderStyles';
import GoogleLoginScreen from '../screens/GoogleLoginScreen';

const Stack = createNativeStackNavigator();

export default function GoogleSingUppStack({ promptAsync }) {
  return (
    <Stack.Navigator initialRouteName="GoogleSignUp" screenOptions={commonHeaderOptions}>
      <Stack.Screen name="GoogleSignUp">
        {() => <GoogleLoginScreen promptAsync={promptAsync} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

GoogleSingUppStack.propTypes = {
  promptAsync: func.isRequired,
};
