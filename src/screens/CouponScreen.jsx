import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert,
} from 'react-native';
import {
  getFirestore, getDocs, collection, query, where,
} from 'firebase/firestore';

import CouponItem from '../components/CouponItem';
import FilterItem from '../components/FilterItem';

export default function CouponScreen() {
  const [coupons, setcoupons] = useState([]);
  useEffect(() => {
    // 期間限定メニューの追加
    const fetchLimitTimeMenu = async () => {
      try {
        const db = getFirestore();
        const ref = query(collection(db, 'coupons'));
        const querySnapshot = await getDocs(ref);
        const dbCoupon = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          dbCoupon.push({
            name: data.name,
            expiredate: data.expiredate,
            target: data.target,
            content: data.content,
          });
        });
        setcoupons(dbCoupon);
        console.log(dbCoupon);
      } catch (error) {
        console.error(error);
        Alert.alert('データの読み込みに失敗しました');
      }
    };
    fetchLimitTimeMenu(); // 非同期関数を即座に呼び出す
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <View style={styles.subtitle}>
          <Text style={styles.subtitleText}>クーポン一覧</Text>
        </View>
        <FilterItem />
      </View>
      <ScrollView contentContainerStyle={styles.itemContainer}>
        <CouponItem couponId={456} style={{ backgroundColor: '#99FFFF' }} />
        <CouponItem couponId={456} style={{ backgroundColor: '#99FF99' }} />
        <CouponItem couponId={456} />
        <CouponItem couponId={456} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    marginLeft: 30,
  },
  subtitleText: {
    fontSize: 18,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingRight: 40,
    backgroundColor: 'rgb(242, 242, 242)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.10,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterInner: {
    borderWidth: 1,
    borderColor: '#696969',
    borderRadius: 20,
    width: 120,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 16,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    zIndex: 1,
    padding: 10,
  },
  itemContainer: {
    alignItems: 'center',
  },
});
