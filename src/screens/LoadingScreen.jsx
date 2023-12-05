import React from 'react';
import {
  View, ActivityIndicator, Text, StyleSheet,
} from 'react-native';
import { string } from 'prop-types';

function LoadingScreen(props) {
  const { content } = props;
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#orange" />
      <Text style={[styles.loadingText, { textAlign: 'center' }]}>{`${content}...`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10, // ローディングスピナーからの距離
  },
});

LoadingScreen.propTypes = {
  content: string.isRequired,
};

export default LoadingScreen;
