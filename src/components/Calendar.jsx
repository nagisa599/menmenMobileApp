import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Calendar() {
  // ここに状態管理やハンドラーなどのロジックを記述します。

  // ダミーデータ
  const schedule = [
    { day: '月', lunch: '11:30~13:30', dinner: '18:00~20:00' },
    { day: '火', lunch: '11:30~13:30', dinner: '17:00~19:00' },
    { day: '水', lunch: '11:00~13:30', dinner: '17:00~19:00' },
    { day: '木', lunch: '11:00~13:30', dinner: '17:00~19:00' },
    { day: '金', lunch: '11:00~13:30', dinner: '17:00~19:00' },
    { day: '土', lunch: '11:00~13:30', dinner: '17:00~19:00' },
    { day: '日', lunch: '11:00~13:30', dinner: '17:00~19:00' },
  ];

  const dayoff = [
    { day: '10/19' },
    { day: '10/25' },
  ];

  const today = new Date();
  const todayDayOfWeek = today.getDay();

  const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];

  const todayLabel = daysOfWeek[todayDayOfWeek];

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>2023年10月</Text>
      <View style={styles.calendarContainer}>
        {schedule.map((item, index) => (
          <View
          // eslint-disable-next-line react/no-array-index-key
            key={index}
            style={[
              styles.dayContainer,
              todayLabel === item.day && styles.todayBackground,
            ]}
          >
            <Text style={styles.dayText}>{item.day}</Text>
            <Text style={styles.timeText}>{item.lunch}</Text>
            <Text style={styles.timeText}>{item.dinner}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.headerText}>休業日</Text>
      <View>
        {dayoff.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <View key={index}>
            <Text>{item.day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  dayContainer: {
    alignItems: 'center',
    backgroundColor: '#EEE', // ここに適切な背景色を設定
    padding: 10,
    borderRadius: 10,
    width: '45%',
    margin: '2.5%',
  },
  todayBackground: {
    backgroundColor: 'orange', // 今日の日付に適用する背景色
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timeText: {
    fontSize: 14,
  },
});
