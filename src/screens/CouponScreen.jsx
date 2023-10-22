import React, { useContext, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert,
} from 'react-native';
import {
  getDocs, collection, query, getDoc, doc,
} from 'firebase/firestore';
import db from '../../firebaseConfig';
// import { userInfoContext } from '../../App';
import userInfoContext from '../utils/UserInfoContext';
import CouponItem from '../components/CouponItem';
import FilterItem from '../components/FilterItem';

export default function CouponScreen() {
  const { userInfo, setUserInfo } = useContext(userInfoContext);
  const [coupons, setCoupons] = useState([]);
  const [filterCoupons, setFilterCoupon] = useState([]);
  const [filter, setFilter] = useState('0');
  // ログインしているかのチェック（最初のアクセスのみ発火)
  useEffect(() => {
    if (userInfo) {
      fetchData();
    } else {
      Alert.alert(
        'こちらのサービスを利用するには、ログインが必要です',
        '',
        [
          {
            text: 'OK',
            onPress: () => {
              setUserInfo(null);
            },
          },
        ],
      );
    }
  }, []);

  // filter変更時に発火するイベント
  useEffect(() => {
    couponFilter();
  }, [filter]);

  // Userに基づいたクーポンの取得
  const fetchData = async () => {
    try {
      const myCoupons = [];
      const ref = query(collection(db, `users/${userInfo.uid}/hasCoupons`));
      const querySnapshot = await getDocs(ref);
      await Promise.all(querySnapshot.docs.map(async (docCoupon) => { // 全ての非同期初期が終わったら
        const couponId = docCoupon.id;
        const ref2 = doc(db, 'coupons', couponId);
        const docSnapshot = await getDoc(ref2);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          myCoupons.push({
            id: couponId,
            name: data.name,
            content: data.content,
            used: docCoupon.data().used,
            expireDate: docCoupon.data().expire.toDate(),
          });
        } else {
          Alert.alert('ただいまご利用できるクーポンはありません');
        }
      }));
      setCoupons(myCoupons);
      const firstSetCoupons = myCoupons.filter((coupon) => coupon.used === false);
      setFilterCoupon(firstSetCoupons);
    } catch (error) {
      Alert.alert('データの読み込みに失敗しました');
    }
  };
  // couponを条件によって絞るメソッド
  const couponFilter = () => {
    const today = new Date();
    let functionFilterCoupons;
    /* eslint-disable */
    switch (filter) {
      case '0':
        functionFilterCoupons = coupons.filter((coupon) => {
          return coupon.expireDate > today && coupon.used == false;
        });;
        setFilterCoupon(functionFilterCoupons);
        break;
      case '1':
        functionFilterCoupons = coupons.filter((coupon) => {
          return coupon.expireDate > today && coupon.used == false && coupon.expire > new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()); 
        });
        setFilterCoupon(functionFilterCoupons);
        break;
      case '2':
        functionFilterCoupons = coupons.filter((coupon) => {
          return coupon.expireDate > today && coupon.used == false && coupon.expire > new Date(today.getFullYear(), today.getMonth() + 3, today.getDate())
        });
        setFilterCoupon(functionFilterCoupons);
        break;
      case '3':
        functionFilterCoupons = coupons.filter((coupon) => {
          return coupon.used == true
        });
        setFilterCoupon(functionFilterCoupons);
        break;
      
    };
  };
  /* eslint-enable */
  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <View style={styles.subtitle}>
          <Text style={styles.subtitleText}>クーポン一覧</Text>
        </View>
        <FilterItem setFilter={setFilter} />
      </View>
      <ScrollView contentContainerStyle={styles.itemContainer}>
        {filterCoupons.map((coupon) => (
          <CouponItem
            coupon={coupon}
            key={coupon.name}
            setCoupons={setCoupons}
            coupons={coupons}
          />
        ))}
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
