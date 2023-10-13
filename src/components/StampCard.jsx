import { useNavigation } from '@react-navigation/native';
import { bool } from 'prop-types';
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';

export default function StampCard(props) {
  const { visited } = props;
  const navigation = useNavigation();
  const totalStamps = 10;
  // スタンプの日付を保存するためのステート
  const [stamps, setStamps] = useState(Array(totalStamps).fill(null));

  const activateStamp = () => {
    const index = stamps.findIndex((stamp) => !stamp); // 最初のnull値を見つける
    if (index !== -1) {
      const newStamps = [...stamps];
      newStamps[index] = new Date().toLocaleDateString(); // 現在の日付を設定
      setStamps(newStamps);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.stampContainer}>
        {stamps.map((stamp, index) => (
          <View
            // key={index}
            style={[
              styles.stamp,
              { backgroundColor: stamp ? 'blue' : 'gray' },
            ]}
          >
            {stamp && <Text style={styles.dateText}>{stamp}</Text>}
            {/* 日付を表示 */}
          </View>
        ))}
      </View>
      <TouchableOpacity
        onPress={() => { navigation.navigate('ComingCheck'); }}
        style={[styles.button, visited ? styles.buttonDisabled : {}]}
        disabled={visited}
      >
        <Text style={styles.buttonText}>来店記録をとる</Text>
      </TouchableOpacity>
    </View>
  );
}

StampCard.propTypes = {
  visited: bool.isRequired,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  stampContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    width: 300,
    alignSelf: 'center',
  },
  stamp: {
    width: 50,
    height: 50,
    margin: 5,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    color: 'white',
    fontSize: 10,
  },
  button: {
    padding: 10,
    backgroundColor: 'black',
  },
  buttonText: {
    color: 'white',
  },
  buttonDisabled: {
    backgroundColor: 'lightgray', // 例: 無効なボタンの背景色を変更
  },
});
