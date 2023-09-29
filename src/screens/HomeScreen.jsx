import React from 'react';
import { View, Text } from 'react-native';
import Button from '../components/Button';

export default function HomeScreen() {
  return (
    <View>
      <Text>これは、ホーム画面です</Text>
      <Button label="ボタン" />
      <Button label="ボタン２" />
    </View>
  );
}
