import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { string } from 'prop-types';

export default function CircleTitle(props) {
  const { content } = props;
  return (
    <View style={styles.circle}>
      <Text style={styles.text}>{content}</Text>
    </View>
  );
}

CircleTitle.propTypes = {
  content: string.isRequired,
};

const styles = StyleSheet.create({
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgb(0, 0, 0)',
    borderWidth: 1,
    backgroundColor: '#FFCC00',
  },
  text: {
    fontSize: 20,
  },
});
