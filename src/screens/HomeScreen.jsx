import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Message from '../components/Message';

// Assets
const timeIcon = require('../../assets/time.png');

// Constants
const imageWidth = 350;
const aspectRatio = 692 / 1014;
const imageHeight = imageWidth * aspectRatio;

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.questionContainer}
          onPress={() => navigation.navigate('Question')}
        >
          <Text style={styles.questionText}>臨時アンケート回答</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <View style={styles.businessHourBox}>
          <Image source={timeIcon} style={styles.imageStyle} resizeMode="contain" />
        </View>
        <View style={styles.separator} />
        <Message />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // 背景色を少し明るくする
  },
  content: {
    paddingHorizontal: 40,
    paddingVertical: 30,
  },
  businessHourBox: {
    width: imageWidth,
    height: imageHeight,
    marginVertical: 30, // 余白を増やす
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  questionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 30,
    backgroundColor: '#4A90E2', // ボタンの背景色変更
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: 'gray', // 線の色を選択してください
    marginHorizontal: 10,
  },
});
