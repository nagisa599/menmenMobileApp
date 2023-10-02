import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { string } from 'prop-types';

export default function SettingItem(props) {
  const { content } = props;
  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.content}>{content}</Text>
    </TouchableOpacity>
  );
}

SettingItem.propTypes = {
  content: string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    width: '75%',
    height: 80,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  content: {
    fontSize: 20,
  },
});
