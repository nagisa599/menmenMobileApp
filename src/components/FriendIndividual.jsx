import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert, Image,
} from 'react-native';

<View style={styles.individual}>
  <Image
    source={require('../../assets/fujiwarashi.jpg')}
    style={styles.image}
  />
  <View style={styles.sortinfo}>
    <Text style={styles.name}>フジワラ</Text>
    <Text style={styles.date}>2023/09/23 10:42</Text>
  </View>
  <View style={styles.basicinfo}>
    <Text style={styles.ranking}>ランキング: 10位</Text>
    <Text style={styles.degree}>称号　　　: ラーメン王</Text>
    <Text style={styles.favorite}>お気に入り: 塩ラーメン</Text>
  </View>
</View>

const styles = StyleSheet.create({
  individual: {
    marginBottom: 2,
    margintop: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  name: {
    lineHeight: 40,
    fontSize: 20,
    fontWeight: 'bold',
  },
  sortinfo: {
    justifyContent: 'center',
    paddingLeft: 10,
  },
  basicinfo: {
    justifyContent: 'center',
    paddingLeft: 15,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 2,
  },
});
