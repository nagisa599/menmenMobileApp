import React, { useState } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import { func } from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
import DateTimePicker from '@react-native-community/datetimepicker';

export default function BirthdayInput(props) {
  const { onDateChange } = props;
  const [date, setDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    onDateChange(currentDate);
  };

  return (
    <View style={styles.container}>
      <DateTimePicker
        testID="dateTimePicker"
        value={date}
        mode="date"
        display="default"
        onChange={onChange}
      />
    </View>
  );
}

BirthdayInput.propTypes = {
  onDateChange: func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
});
