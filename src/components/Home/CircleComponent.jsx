import { func, string } from 'prop-types';
import React from 'react';
import {
  Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function CircleComponent(props) {
  const { text, onPress, iconName } = props;
  if (text === 'アンケート') {
    function Icon() {
      return (
        <FontAwesome name={iconName} size={30} color="white" />
      )
    }
  }
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.contentText}>{text}</Text>
    </TouchableOpacity>
  );
}

CircleComponent.propTypes = {
  text: string.isRequired,
  onPress: func.isRequired,
  iconName: string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    borderColor: 'black',
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 20,
  },
  contentText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});
