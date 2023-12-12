import React, { useContext, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions, ImageBackground,
} from 'react-native';
import imageStampCard from '../../../assets/stampcard2.png';
import userInfoContext from '../../utils/UserInfoContext';

export default function StampCard() {
  const { userInfo } = useContext(userInfoContext);
  const userVisited = userInfo.times;
  const totalStamps = 10;
  // 来店回数が0なら1枚表示、それ以外なら来た回数 // 10 + 1枚スタンプカードを作成
  const maxPages = userVisited.length === 0 ? 1 : Math.ceil(userVisited.length / totalStamps);
  // totalStamp*maxPagesのスタンプ領域をnullで初期化
  const [stamps, setStamps] = useState(Array(totalStamps * maxPages).fill(null));
  const [currentPage, setCurrentPage] = useState(0); // 現在のページ番号

  useEffect(() => {
    // 新しい訪問があった場合に、そのページにスタンプが
    const requiredStampsSize = Math.max(userVisited.length, totalStamps);
    if (stamps.length < requiredStampsSize) {
      // 現在のスタンプ配列にnullで初期化したものを足している
      setStamps(
        (prevStamps) => [...prevStamps, ...Array(requiredStampsSize - prevStamps.length)
          .fill(null)],
      );
    }
    // すでにアクティベートされたスタンプを考慮して、新しいスタンプの配列を生成
    const newStamps = [...stamps];
    userVisited.forEach((timestamp) => {
      // 配列の中で初めてfalsyになるindexを取得
      const index = newStamps.findIndex((stamp) => !stamp);
      if (index !== -1) {
        const date = timestamp.toDate();
        const dateString = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        newStamps[index] = dateString;
      }
    });
    setStamps(newStamps);
  }, [userVisited]);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(stamps.length / 10) - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <ImageBackground source={imageStampCard} style={styles.container}>
      <View style={styles.pagination}>
        <TouchableOpacity onPress={handlePrevPage}>
          <Text style={styles.text}>{'<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextPage}>
          <Text style={styles.text}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.stampContainer}>
        {stamps.slice(currentPage * 10, (currentPage + 1) * 10).map((stamp, index) => (
          /* eslint-disable */
          <View key={index} style={[styles.stamp, { backgroundColor: stamp ? 'orange' : 'gray' }]}>
            {stamp
              ? <Text style={styles.dateText}>{stamp}</Text>
              : <Text style={styles.dateNullText}>{currentPage * 10 + (index + 1)}</Text>}
          </View>
        ))}
      </View>
    </ImageBackground>
  );
}

StampCard.defaultProps = {
  userVisited: [],
};

// 端末の幅を取得
const windowWidth = Dimensions.get('window').width;

// スタンプのサイズや間隔を計算
const stampSize = (windowWidth - 142) / 5;
const stampMargin = 5;

// スタンプのサイズに基づいて、dateTextのフォントサイズを計算
const fontSize = stampSize * 0.16; // スタンプのサイズの20%をフォントサイズとして設定

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  stampContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stamp: {
    width: stampSize,
    height: stampSize,
    margin: stampMargin,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: stampSize / 2,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateText: {
    color: 'black',
    fontSize,
  },
  dateNullText: {
    fontSize: 20,
  },
  button: {
    padding: 12,
    backgroundColor: '#3498db',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    textDecorationLine: 'underline',
  },
});
