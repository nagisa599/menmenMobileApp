import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { func } from 'prop-types';

import commonHeaderOptions from '../styles/NavigationHeaderStyles';
import GoogleLoginScreen from '../screens/GoogleLoginScreen';

const Stack = createNativeStackNavigator();

export default function GoogleSingUppStack(props) {
  const { promptAsync, setUserInfo } = props;
  return (
    <Stack.Navigator initialRouteName="GoogleSignUp" screenOptions={commonHeaderOptions}>
      <Stack.Screen name="GoogleSignUp">
        {() => <GoogleLoginScreen promptAsync={promptAsync} setUserInfo={setUserInfo} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

GoogleSingUppStack.propTypes = {
  promptAsync: func.isRequired,
  setUserInfo: func.isRequired,
};
