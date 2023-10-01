import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { string, func, bool } from 'prop-types';

export default function Tab(props) {
  const { label, onPress, active } = props;
  return (
    <TouchableOpacity style={active ? styles.activeContainer : styles.container} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

Tab.propTypes = {
  label: string.isRequired,
  onPress: func,
  active: bool,
};

Tab.defaultProps = {
  onPress: null,
  active: false,
};

const styles = StyleSheet.create({
  activeContainer: {
    backgroundColor: '#FFCC00',
    width: '33%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
  },
  container: {
    width: '33%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
  },
});
