import React from 'react';
import {
  TouchableOpacity, Text, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

function NotLoginButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>ログインなしで利用</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    width: 350,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#467fd3',
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

NotLoginButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default NotLoginButton;
