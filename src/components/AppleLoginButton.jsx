import React from 'react';
import {
  TouchableOpacity, Text, Image, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import googleLogo from '../../assets/Apple-logo.png';

function AppleLoginButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image source={googleLogo} style={styles.logo} />
      <Text style={styles.buttonText}>Appleでログイン</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    width: 350,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,

  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 10,

  },
  buttonText: {
    color: 'white',
    fontSize: 25,
  },
});

AppleLoginButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default AppleLoginButton;
