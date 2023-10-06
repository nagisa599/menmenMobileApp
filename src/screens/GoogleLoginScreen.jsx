import React from 'react';
import {
  Text, View, StyleSheet,
} from 'react-native';
import { func } from 'prop-types';
import Button from '../components/Button';

export default function GoogleLoginScreen({ promptAsync }) {
  return (
    <View style={styles.container}>
      <View>
        <Text>a</Text>
        <Text>a</Text>
        <Text>a</Text>
        <Text>ログイン画面</Text>
        <Button onPress={() => promptAsync()} label="google認証" />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30,
    backgroundColor: 'blue',
    borderRadius: 4,
  },
});
GoogleLoginScreen.propTypes = {
  promptAsync: func.isRequired,
};
