import React from 'react';
/* eslint-disable */
import { Calendar, LocaleConfig } from 'react-native-calendars';
/* eslint-enable */
import {
  View, StyleSheet, Text, SafeAreaView,
} from 'react-native';

export default function Calender() {
  return (
    <View style={styles.calenderContainer}>
      <SafeAreaView>
        <Calendar
          markingType="period"
          markedDates={{
            '2023-10-04': {
              disabled: true, startingDay: true, color: 'red', endingDay: true,
            },
            '2023-10-11': {
              disabled: true, startingDay: true, color: 'red', endingDay: true,
            },
            '2023-10-19': {
              disabled: true, startingDay: true, color: 'red', endingDay: true,
            },
            '2023-10-26': {
              disabled: true, startingDay: true, color: 'red', endingDay: true,
            },
          }}
        />
      </SafeAreaView>
      <View style={styles.calenderTextBox}>
        <Text style={styles.calenderText}>定休日  🔴</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  calenderContainer: {
    width: '75%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderWidth: 3,
    borderColor: 'rgba(0,0,0,0.100)',
  },
  calenderText: {
    padding: 20,
    fontSize: 20,
  },
});
LocaleConfig.locales.jp = {
  monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
  dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
};
LocaleConfig.defaultLocale = 'jp';
