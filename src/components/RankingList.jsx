import React from 'react';
import {
  StyleSheet, Text, View, Image,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { number, string } from 'prop-types';
import Icon from './icon';
import CircleTitle from './CircleTitle';
import getDownloadedImageUri from '../utils/getDownloadImage';

export default function RankingList(props) {
  const {
    rank, imageUrl, times, name, title,
  } = props;
  let iconColor = '#555'; // デフォルトのアイコンの色

  // ランキングに応じてアイコンの色を設定
  if (rank === 1) {
    iconColor = 'gold'; // 1位の場合は金色
  } else if (rank === 2) {
    iconColor = 'silver'; // 2位の場合は銀色
  } else if (rank === 3) {
    iconColor = '#cd7f32'; // 3位の場合は銅色（ブロンズ）
  }

  return (
    <View style={[styles.container]}>
      <View style={styles.icon}>
        <Icon name="ramen_icon" size={60} color={iconColor} />
      </View>
      <Text style={[styles.rank, rank === 10 ? styles.rank10 : null]}>{`${rank}`}</Text>
      <Image source={{ uri: getDownloadedImageUri(imageUrl) }} style={styles.profileImage} />
      <View style={styles.titleImage}>
        <CircleTitle title={title} />
      </View>
      <View style={styles.info}>
        <Text style={styles.user}>{name}</Text>
        <View style={styles.timesContainer}>
          <FontAwesome5 name="clock" size={18} color="#a0522d" />
          <Text style={styles.times}>{`${times} 回!`}</Text>
        </View>
      </View>
    </View>
  );
}

RankingList.propTypes = {
  rank: number.isRequired,
  times: number.isRequired,
  name: string.isRequired,
  imageUrl: string.isRequired,
  title: number.isRequired,
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: 'rgba(220, 220, 220, 0.5)',
    flexDirection: 'row',
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    marginBottom: 15,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  profileImage: {
    height: 60,
    width: 60,
    borderRadius: 10,
  },
  rank: {
    position: 'absolute',
    top: 40,
    left: 25,
    marginLeft: 15,
    fontSize: 25,
    fontWeight: '500',
    color: '#555',
  },
  firstPlaceRank: {
    color: 'red',
  },
  icon: {
    paddingLeft: 20,
    paddingHorizontal: 20,
  },
  titleImage: {
    position: 'absolute',
    left: 120,
    top: 30,
  },
  info: {
    flex: 6,
    marginRight: 0,
    paddingLeft: 30,
  },
  user: {
    fontWeight: '500',
    fontSize: 20,
    color: '#4a4a4a',
    marginLeft: 5,
    marginRight: 10,
  },
  timesContainer: {
    flexDirection: 'row',
  },
  times: {
    fontSize: 18,
    fontWeight: '500',
    color: '#a0522d',
    marginLeft: 5,
  },
  rank10: {
    position: 'absolute',
    top: 45,
    left: 20,
    marginLeft: 15,
    fontSize: 25,
    fontWeight: '500',
    color: '#555',
  },
});
