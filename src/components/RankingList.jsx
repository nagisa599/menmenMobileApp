import React from 'react';
import {
  StyleSheet, TouchableOpacity, Text, View,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { number, string } from 'prop-types';

export default function RankingList({ rank, times, name }) {
  return (
    <TouchableOpacity style={[styles.container, rank === 1 ? styles.firstPlaceContainer : {}]}>
      {rank === 1 && <FontAwesome5 name="crown" size={24} color="gold" style={styles.icon} />}
      <Text style={[styles.rank, rank === 1 ? styles.firstPlaceRank : {}]}>{`${rank} .`}</Text>
      <View style={styles.info}>
        <FontAwesome5 name="user-alt" size={18} color="gray" />
        <Text style={styles.user}>{name}</Text>
        <FontAwesome5 name="clock" size={18} color="#a0522d" />
        <Text style={styles.times}>{`${times} 回!`}</Text>
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
    borderWidth: 2,
    borderColor: 'rgba(220, 220, 220, 0.5)',
    flexDirection: 'row',
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    marginBottom: 15,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  firstPlaceContainer: {
    borderColor: 'gold',
    backgroundColor: 'rgba(255, 223, 186, 0.9)',
  },
  rank: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: '500',
    color: '#555',
    flex: 1,
  },
  firstPlaceRank: {
    color: 'red',
  },
  icon: {
    marginRight: 10,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 6,
    marginRight: 15,
  },
  user: {
    fontWeight: '500',
    fontSize: 20,
    color: '#4a4a4a',
    marginLeft: 5,
    marginRight: 10,
  },
  times: {
    fontSize: 18,
    fontWeight: '500',
    color: '#a0522d',
    marginLeft: 5,
  },
});
