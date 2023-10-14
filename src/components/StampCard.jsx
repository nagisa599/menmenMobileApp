import { useNavigation } from '@react-navigation/native';
import {
  arrayOf, bool, func, string,
} from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';

export default function StampCard(props) {
  const { visited, setVisited, userVisited } = props;
  const navigation = useNavigation();
  const totalStamps = 10;
  const [stamps, setStamps] = useState(Array(totalStamps).fill(null));
  const [currentPage, setCurrentPage] = useState(0); // 現在のページ番号

  // const activateStamp = () => {
  //   const index = stamps.findIndex((stamp) => !stamp);
  //   if (index !== -1) {
  //     const newStamps = [...stamps];
  //     newStamps[index] = new Date().toLocaleDateString();
  //     setStamps(newStamps);
  //   }
  // };

  const activateStamp = (date) => {
    const index = stamps.findIndex((stamp) => !stamp);
    if (index !== -1) {
      const newStamps = [...stamps];
      newStamps[index] = date;
      setStamps(newStamps);
    }
  };

  useEffect(() => {
    // すでにアクティベートされたスタンプを考慮して、新しいスタンプの配列を生成
    const newStamps = [...stamps];
    userVisited.forEach((date) => {
      const index = newStamps.findIndex((stamp) => !stamp);
      if (index !== -1) {
        newStamps[index] = date;
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
    <View style={styles.container}>
      <View style={styles.pagination}>
        <TouchableOpacity onPress={handlePrevPage}>
          <Text>前のページ</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextPage}>
          <Text>次のページ</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.stampContainer}>
        {stamps.slice(currentPage * 10, (currentPage + 1) * 10).map((stamp, index) => (
          <View key={index} style={[styles.stamp, { backgroundColor: stamp ? 'blue' : 'gray' }]}>
            {stamp && <Text style={styles.dateText}>{stamp}</Text>}
          </View>
        ))}
      </View>
      <TouchableOpacity
        onPress={() => { navigation.navigate('ComingCheck', { activateStamp, setVisited }); }}
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
  setVisited: func.isRequired,
  userVisited: arrayOf(
    string,
  ),
};

StampCard.defaultProps = {
  userVisited: [],
};

// 端末の幅を取得
const windowWidth = Dimensions.get('window').width;

// スタンプのサイズや間隔を計算
const stampSize = (windowWidth - 160) / 5;
const stampMargin = 5;

// スタンプのサイズに基づいて、dateTextのフォントサイズを計算
const fontSize = stampSize * 0.17; // スタンプのサイズの20%をフォントサイズとして設定

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
    borderRadius: 5,
  },
  dateText: {
    color: '#fff',
    fontSize,
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
});
