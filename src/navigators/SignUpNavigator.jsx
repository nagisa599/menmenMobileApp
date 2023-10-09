import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { func, shape } from 'prop-types';
import commonHeaderOptions from '../styles/NavigationHeaderStyles';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createNativeStackNavigator();

export default function SignUpStack(props) {
  const { onSignedUp, userInfo, setUserInfo } = props;
  return (
    <Stack.Navigator initialRouteName="SignUp" screenOptions={commonHeaderOptions}>
      <Stack.Screen name="SignUp">
        {() => (
          <SignUpScreen
            onSignedUp={onSignedUp}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

SignUpStack.propTypes = {
  onSignedUp: func.isRequired,
  userInfo: shape().isRequired,
  setUserInfo: func.isRequired,
};
