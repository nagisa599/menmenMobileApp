import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { string, func, bool } from 'prop-types';

export default function SmallTab(props) {
  const { label, onPress, active } = props;
  return (
    <TouchableOpacity style={active ? styles.activeContainer : styles.container} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

SmallTab.propTypes = {
  label: string.isRequired,
  onPress: func,
  active: bool,
};

SmallTab.defaultProps = {
  onPress: null,
  active: false,
};

const styles = StyleSheet.create({
  activeContainer: {
    backgroundColor: '#FFCC00',
    width: '25%', // 幅を小さく
    height: 40, // 高さを小さく
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8, // 角を少し丸く
  },
  container: {
    width: '25%', // 幅を小さく
    height: 40, // 高さを小さく
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8, // 角を少し丸く
  },
  label: {
    fontSize: 14, // フォントサイズを小さく
  },
});
