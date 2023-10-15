import React from 'react';
import {
  TouchableOpacity, StyleSheet, Text,
} from 'react-native';
import { string, func } from 'prop-types';

export default function AddButton(props) {
  const { label, onPress } = props;
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <Text style={styles.buttonLabel}>{label}</Text>
    </TouchableOpacity>
  );
}
AddButton.propTypes = {
  label: string.isRequired,
  onPress: func,
};

AddButton.defaultProps = {
  onPress: null,
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: 'black',
    borderRadius: 5,
    // alignSelf: 'flex-start', // 自分自身を並べる。左側に
    marginBottom: 5,
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonLabel: {
    fontSize: 18,
    paddingHorizontal: 6,
    paddingVertical: 6,
    color: '#ffffff',
  },
});
