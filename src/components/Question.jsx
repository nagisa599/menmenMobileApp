import React from 'react';
import {
  Text, StyleSheet, TouchableOpacity,
} from 'react-native';

export default function Question() {
  return (
    <TouchableOpacity style={styles.container}>
      <Text>アンケート回答画面</Text>
      <Text>GoogleFormに飛ばす</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
  },
});
