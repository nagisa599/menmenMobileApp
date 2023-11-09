import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import Calendar from '../components/Calendar';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleContainer}>
          <Entypo name="check" size={48} color="#000" />
          <Text style={styles.title}>アンケートのお願い</Text>
        </View>
        <View style={styles.explain}>
          <Text>新メニューやアプリについて簡単な</Text>
          <Text>アンケートの回答をお願いしております</Text>
          <Text>ぜひ皆様の意見を聞かせてください！！</Text>
        </View>
        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.navigate('Question')}
        >
          <Text style={styles.linkText}>アンケートに回答する</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <View style={styles.titleContainer}>
          <Entypo name="check" size={48} color="#000" />
          <Text style={styles.title}>営業日 / 営業時間</Text>
        </View>
        <View style={styles.calendarContainer}>
          <Calendar />
        </View>
        <View style={styles.separator} />
        <View style={styles.titleContainer}>
          <Entypo name="check" size={48} color="#000" />
          <Text style={styles.title}>提供直前のコール</Text>
        </View>
        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.navigate('Message')}
        >
          <Text style={styles.linkText}>コールの確認はこちら！</Text>
        </TouchableOpacity>
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
  calendarContainer: {
    flex: 1,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  linkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 30,
    // backgroundColor: '#4A90E2', // ボタンの背景色変更
    backgroundColor: 'orange',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 20,
    width: '80%',
    marginHorizontal: '10%',
  },
  linkText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: 'gray', // 線の色を選択してください
    marginVertical: 10,
  },
  titleContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  explain: {
    width: '80%',
    marginHorizontal: '10%',
    marginBottom: 20,
  },
});
