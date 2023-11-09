import React from 'react';
import {
  View, ActivityIndicator, Text, StyleSheet,
} from 'react-native';

function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#orange" />
      <Text style={styles.loadingText}>データ取得中...</Text>
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

export default LoadingScreen;
