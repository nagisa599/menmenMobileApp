import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { number, string } from 'prop-types';
import { FontAwesome5 } from '@expo/vector-icons';

export default function RankingList(props) {
  const { rank, times, name } = props;

  let containerStyle = styles.container;
  let rankStyle = styles.rank;

  // ランキングが1位の場合にスタイルを変更
  if (rank === 1) {
    containerStyle = { ...styles.container };
    rankStyle = { ...styles.rank, color: 'red' };
  }

  return (
    <TouchableOpacity style={containerStyle}>
      {rank === 1 && <FontAwesome5 name="crown" size={30} color="gold" style={styles.icon} />}
      <Text style={rankStyle}>
        {`${rank} .`}
      </Text>
      <View style={styles.info}>
        <Text style={styles.user}>{name}</Text>
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
  name: string.isRequired,
};

RankingList.defaultProps = {
  rank: null,
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1, // 最後のところはまた後でFlatListやmapでborderつける
    borderColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgb(242, 242, 242)',
    borderRadius: 20,
    marginBottom: 30,
    marginHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.10,
    shadowRadius: 3.84,
    elevation: 5,
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
