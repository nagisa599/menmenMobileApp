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
    borderRadius: 10,
    alignSelf: 'center', // 自分自身を並べる。左側に
    width: '45%',
    alignItems: 'center',
    marginLeft: 10
  },
  buttonLabel: {
    fontSize: 28,
    paddingHorizontal: 5,
    paddingVertical: 15,
    color: '#ffffff',
  },
});
