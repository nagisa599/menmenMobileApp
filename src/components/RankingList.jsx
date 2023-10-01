import React from 'react';
import {
  StyleSheet, TouchableOpacity, Text, View,
} from 'react-native';
import { number } from 'prop-types';

export default function RankingList(props) {
  const { rank, times } = props;
  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.rank}>
        {`${rank} .`}
      </Text>
      <View style={styles.info}>
        <Text style={styles.user}>ユーザー名</Text>
        <Text style={styles.times}>
          {`${times} 回!`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

RankingList.propTypes = {
  rank: number,
  times: number.isRequired,
};

RankingList.defaultProps = {
  rank: null,
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1, // 最後のところはまた後でFlatListやmapでborderつける
    borderColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rank: {
    marginLeft: 30,
    fontSize: 20,
    flex: 1,
  },
  info: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 7,
  },
  user: {
    fontWeight: 'bold',
    fontSize: 25,
    color: '#a0522d',
  },
  times: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
