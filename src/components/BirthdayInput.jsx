// import React, { useState } from 'react';
// import {
//   View, StyleSheet, Button, Platform,
// } from 'react-native';
// import { func } from 'prop-types';
// import DateTimePicker from '@react-native-community/datetimepicker';

// export default function BirthdayInput(props) {
//   const { onDateChange } = props;
//   const [date, setDate] = useState(new Date());
//   const [showPicker, setShowPicker] = useState(false);

//   const onChange = (event, selectedDate) => {
//     const currentDate = selectedDate || date;
//     setDate(currentDate);
//     onDateChange(currentDate);
//     if (Platform.OS === 'android') {
//       setShowPicker(false);
//     }
//   };

//   const showDatepicker = () => {
//     setShowPicker(true);
//   };

//   return (
//     <View style={styles.container}>
//       <Button title="Select Date" onPress={showDatepicker} />
//       {showPicker && (
//         <DateTimePicker
//           testID="dateTimePicker"
//           value={date}
//           mode="date"
//           display="default"
//           onChange={onChange}
//         />
//       )}
//     </View>
//   );
// }

// BirthdayInput.propTypes = {
//   onDateChange: func.isRequired,
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'flex-start',
//     flexDirection: 'column',
//   },
// });

import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { func } from 'prop-types';
import { Picker } from '@react-native-picker/picker';

export default function BirthdayInput(props) {
  const { onDateChange } = props;
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(selectedMonth));

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    setDaysInMonth(getDaysInMonth(selectedMonth));
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  }, [selectedMonth]);

  const handleDateChange = () => {
    onDateChange(`${selectedMonth}-${selectedDay}`);
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedMonth}
        style={styles.picker}
        onValueChange={(itemValue) => {
          setSelectedMonth(itemValue);
          handleDateChange();
        }}
      >
        {months.map((month) => (
          <Picker.Item key={month} label={month.toString()} value={month} />
        ))}
      </Picker>
      <Picker
        selectedValue={selectedDay}
        style={styles.picker}
        onValueChange={(itemValue) => {
          setSelectedDay(itemValue);
          handleDateChange();
        }}
      >
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
          <Picker.Item key={day} label={day.toString()} value={day} />
        ))}
      </Picker>
    </View>
  );
}

function getDaysInMonth(month) {
  const year = new Date().getFullYear();
  return new Date(year, month, 0).getDate();
}

BirthdayInput.propTypes = {
  onDateChange: func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    flex: 1,
  },
});
