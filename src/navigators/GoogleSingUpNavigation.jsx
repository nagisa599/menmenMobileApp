import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { func } from 'prop-types';

import GoogleLoginScreen from '../screens/GoogleLoginScreen';

const Stack = createNativeStackNavigator();

export default function GoogleSingUppStack(props) {
  const { promptAsync } = props;
  return (
    <Stack.Navigator initialRouteName="GoogleSignUp">
      <Stack.Screen name="GoogleSignUp" options={{ headerShown: false }}>
        {() => <GoogleLoginScreen promptAsync={promptAsync} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

GoogleSingUppStack.propTypes = {
  promptAsync: func.isRequired,
};
