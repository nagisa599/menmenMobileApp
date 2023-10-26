import React from 'react';
import { View, StyleSheet } from 'react-native';
import { number } from 'prop-types';

export default function DottedLine(props) {
  const { dotCount } = props;
  const generateUniqueKey = (index) => `dot_${index}`;
  return (
    <View style={styles.dottedLine}>
      {Array(dotCount)
        .fill(null)
        .map((_, index) => (
          <View style={styles.dot} key={generateUniqueKey(index)} />
        ))}
    </View>
  );
}

DottedLine.propTypes = {
  dotCount: number.isRequired,
};

const styles = StyleSheet.create({
  dot: {
    width: 3, // Width of each dot
    height: 3, // Height of each dot
    backgroundColor: '#ddd', // Color of the dots
    borderRadius: 50, // Makes the dots round
  },
  dottedLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
