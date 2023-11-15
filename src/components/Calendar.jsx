/* eslint-disable quote-props */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  collection, getDocs, getFirestore, query, where,
} from 'firebase/firestore';
import LoadingScreen from '../screens/LoadingScreen';

export default function Calendar() {
  const [schedule, setSchedule] = useState([]);
  const [dayoff, setDayoff] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const todayDayOfWeek = today.getDay();
  const daysOfWeek = ['月', '火', '水', '木', '金', '土', '日'];
  const dayMapping = {
    'monday': '月',
    'tuesday': '火',
    'wednesday': '水',
    'thursday': '木',
    'friday': '金',
    'saturday': '土',
    'sunday': '日',
  };
  const todayLabel = daysOfWeek[todayDayOfWeek];

  useEffect(() => {
    const db = getFirestore();
    const calendarRef = query(
      collection(db, 'calendar'),
      where('year', '==', currentYear),
      where('month', '==', currentMonth),
    );

    // Firestoreからデータを取得し、スケジュールと休業日の状態を更新
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(calendarRef);
        const fetchedSchedule = {
          '月': null, '火': null, '水': null, '木': null, '金': null, '土': null, '日': null,
        };
        const fetchedDayoff = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.schedule) {
            Object.keys(data.schedule).forEach((dayKey) => {
              const japaneseDay = dayMapping[dayKey];
              fetchedSchedule[japaneseDay] = data.schedule[dayKey];
            });
          }
          if (data.dayoff) {
            fetchedDayoff.push({
              day: data.dayoff.day,
            });
          }
        });
        const sortedSchedule = daysOfWeek.map((day) => ({
          day,
          ...fetchedSchedule[day],
        }));

        setSchedule(sortedSchedule);
        setDayoff(fetchedDayoff);
        setLoading(false);
      } catch (error) {
        console.error('error getting documents:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentYear, currentMonth]);

  // 今日の日付が休業日リストに含まれているかチェックする関数
  function isTodayDayOff() {
    const todayStr = `${currentMonth}/${today.getDate()}`;
    return dayoff.some((d) => d.day === todayStr);
  }

  const dayOffStyle = {
    backgroundColor: 'orange',
  };

  return (
    <View style={styles.container}>
      {isLoading ? <LoadingScreen /> : (
        <View>
          <Text style={styles.headerText}>営業日 / 営業時間</Text>
          <View style={styles.calendarContainer}>
            {schedule.map((item, index) => (
              <View
              // eslint-disable-next-line react/no-array-index-key
                key={index}
                style={[
                  styles.dayContainer,
                  todayLabel === item.day && !isTodayDayOff() && styles.todayBackground,
                ]}
              >
                <Text style={styles.dayText}>{item.day}</Text>
                <Text style={styles.timeText}>{item.lunch}</Text>
                <Text style={styles.timeText}>{item.dinner}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.headerText}>休業日</Text>
          <View style={styles.dayOffContainer}>
            {dayoff.map((item, index) => (
              <View
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                style={[styles.dayOffWrapper, isTodayDayOff() && dayOffStyle]}
              >
                <Text style={styles.dayOffText}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
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
  dayOffContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayOffWrapper: {
    backgroundColor: '#EEE', // 休業日の背景色を明るい赤色に設定
    borderRadius: 10,
    padding: 20,
    marginVertical: 5, // 休業日のアイテム間のマージン
  },
  dayOffText: {
    fontSize: 16,
    color: 'black', // 休業日のテキスト色を設定
    fontWeight: 'bold',
  },
});
