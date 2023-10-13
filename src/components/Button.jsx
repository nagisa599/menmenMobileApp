import React from 'react';
import {
  TouchableOpacity, StyleSheet, Text,
} from 'react-native';
import { string, func } from 'prop-types';

export default function Button(props) {
  const { label, onPress } = props;
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <Text style={styles.buttonLabel}>{label}</Text>
    </TouchableOpacity>
  );
}
Button.propTypes = {
  label: string.isRequired,
  onPress: func,
};

Button.defaultProps = {
  onPress: null,
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: 'black',
    borderRadius: 30,
    // alignSelf: 'flex-start', // 自分自身を並べる。左側に
    marginBottom: 24,
    height: 60,
    width: 350,
  },
  buttonLabel: {
    fontSize: 18,
    lineHeight: 32,
    paddingHorizontal: 100,
    paddingVertical: 15,
    color: '#ffffff',
  },
});
