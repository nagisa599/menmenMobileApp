import React from 'react';
import {
  View, StyleSheet, Text,
} from 'react-native';
import Calender from '../components/Calender';
import Tab from '../components/Tab';

export default function HomeScreen(props) {
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Tab label="その他" onPress={() => {}} active />
        <Tab
          label="メニュー"
          onPress={() => {
            navigation.navigate('MenuScreen');
          }}
        />
      </View>
      <Calender />
      <View style={styles.businessHourBox}>
        <View style={styles.businessHour}>
          <Text>写真</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30,
  },
  firstTextContainer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 30,
  },
  firstText: {
    fontSize: 30,
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
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: 20,
  },
  businessHour: {
    paddingVertical: 80,
    borderWidth: 3,
    borderColor: 'rgba(0,0,0,0.100)',
    width: '100%',
  },

});
