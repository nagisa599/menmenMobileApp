import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { func, shape } from 'prop-types';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createNativeStackNavigator();

export default function SignUpStack(props) {
  const { userInfo, setUserInfo } = props;
  return (
    <Stack.Navigator initialRouteName="SignUp">
      <Stack.Screen name="SignUp">
        {() => (
          <SignUpScreen
            userInfo={userInfo}
            setUserInfo={setUserInfo}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

SignUpStack.propTypes = {
  userInfo: shape().isRequired,
  setUserInfo: func.isRequired,
};
