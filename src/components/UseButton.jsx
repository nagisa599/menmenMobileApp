import React from 'react';
import {
  TouchableOpacity, StyleSheet, Text,
} from 'react-native';
import { string, func } from 'prop-types';

export default function PassButton(props) {
  const { label, onPress } = props;
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <Text style={styles.buttonLabel}>{label}</Text>
    </TouchableOpacity>
  );
}
PassButton.propTypes = {
  label: string.isRequired,
  onPress: func,
};

PassButton.defaultProps = {
  onPress: null,
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: 'black',
    borderRadius: 10,
    alignSelf: 'center', // 自分自身を並べる。左側に
    marginLeft: 60,
    marginTop: 5
  },
  buttonLabel: {
    fontSize: 28,
    paddingHorizontal: 5,
    paddingVertical: 10,
    color: '#ffffff',
  },
});
