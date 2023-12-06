import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
// import { func } from 'prop-types';

import GoogleLoginScreen from '../screens/GoogleLoginScreen';
import EmailRegisterScreen from '../screens/EmailRegisterScreen';
import EmailLoginScreen from '../screens/EmailLoginScreen';

const Stack = createNativeStackNavigator();

export default function GoogleSignUpStack() {
  return (
    <Stack.Navigator initialRouteName="GoogleSignUp">
      <Stack.Screen name="GoogleSignUp" component={GoogleLoginScreen} options={{ headerShown: false }}>
        {/* {() => <GoogleLoginScreen promptAsync={promptAsync} />} */}
      </Stack.Screen>
      <Stack.Screen name="EmailRegister" component={EmailRegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EmailLogin" component={EmailLoginScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// GoogleSignUpStack.propTypes = {
//   promptAsync: func.isRequired,
// };
