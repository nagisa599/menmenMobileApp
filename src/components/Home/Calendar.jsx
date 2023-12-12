/* eslint-disable quote-props */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  collection, getDocs, getFirestore, query, where,
} from 'firebase/firestore';
import LoadingScreen from '../../screens/LoadingScreen';

export default function Calendar() {
  const [businessHours, setBusinessHours] = useState({});
  const [dayoff, setDayoff] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  // 今日が休業日かどうかを判断する関数
  function isTodayDayOff() {
    const todayStr = `${currentMonth}/${today.getDate()}`;
    return dayoff.includes(todayStr);
  }

  // 今日が平日か土曜か日曜かを判断する関数
  function getTodayDayType() {
    const day = today.getDay(); // 日曜日 = 0, 月曜日 = 1, ..., 土曜日 = 6
    if (day === 0) return 'sunday';
    if (day === 6) return 'saturday';
    return 'weekday';
  }

  // 今日が営業日で、かつ平日/土曜/日曜のいずれであるかに基づいて背景色を設定する関数
  function getDayStyle(dayType) {
    if (isTodayDayOff()) return {};
    return getTodayDayType() === dayType ? styles.todayBackground : {};
  }

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

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.businessHours) {
            setBusinessHours(data.businessHours);
          }
          if (data.dayoff) {
            setDayoff(data.dayoff);
          }
        });

        setLoading(false);
      } catch (error) {
        console.error('error getting documents:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentYear, currentMonth]);

  const dayOffStyle = {
    backgroundColor: 'orange',
  };

  return (
    <View style={styles.container}>
      {isLoading ? <LoadingScreen content="データ取得中" /> : (
        <View>
          <Text style={styles.headerText}>営業日 / 営業時間</Text>
          <View style={styles.calendarContainer}>
            <View style={[styles.dayContainer, getDayStyle('weekday')]}>
              <Text>平日</Text>
              <Text>{`${businessHours.weekday.lunch.start}~${businessHours.weekday.lunch.end}`}</Text>
              <Text>{`${businessHours.weekday.dinner.start}~${businessHours.weekday.dinner.end}`}</Text>
            </View>
            <View style={[styles.dayContainer, getDayStyle('saturday')]}>
              <Text>土曜</Text>
              <Text>{`${businessHours.saturday.lunch.start}~${businessHours.saturday.lunch.end}`}</Text>
              <Text>{`${businessHours.saturday.dinner.start}~${businessHours.saturday.dinner.end}`}</Text>
            </View>
            <View style={[styles.dayContainer, getDayStyle('sunday')]}>
              <Text>日曜</Text>
              <Text>{`${businessHours.sunday.lunch.start}~${businessHours.sunday.lunch.end}`}</Text>
              <Text>{`${businessHours.sunday.dinner.start}~${businessHours.sunday.dinner.end}`}</Text>
            </View>
          </View>
          <Text style={styles.headerText}>休業日</Text>
          <View style={styles.dayOffContainer}>
            {dayoff.map((item) => (
              <View key={item} style={[styles.dayOffWrapper, isTodayDayOff() && dayOffStyle]}>
                <Text style={styles.dayOffText}>{item}</Text>
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
    justifyContent: 'space-start',
  },
  dayOffWrapper: {
    backgroundColor: '#EEE', // 休業日の背景色を明るい赤色に設定
    borderRadius: 10,
    padding: 20,
    marginVertical: 5, // 休業日のアイテム間のマージン
    marginHorizontal: 5,
  },
  dayOffText: {
    fontSize: 16,
    color: 'black', // 休業日のテキスト色を設定
    fontWeight: 'bold',
  },
});
