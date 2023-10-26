import React from 'react';
import {
  View, StyleSheet, Image, ScrollView,
} from 'react-native';
import Calender from '../components/Calender';

const time = require('../../assets/time.png');

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Calender />
        <View style={styles.businessHourBox}>
          <View style={styles.businessHour}>
            <Image source={time} style={styles.imageStyle} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30,
  },
  circle: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  lastTextContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 30,
  },
  lastText: {
    fontSize: 30,
  },
  businessHourBox: {
    width: '75%',
    height: 276,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  businessHour: {
    paddingVertical: 80,
    width: '100%',
  },
  imageStyle: {
    width: '100%',
    height: '140%',
    resizeMode: 'contain',
  },
});
