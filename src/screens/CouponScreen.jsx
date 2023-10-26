import React, { useContext, useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, Alert,
} from 'react-native';
import {
  getDocs, collection, query, getDoc, doc,
} from 'firebase/firestore';
import db from '../../firebaseConfig';
// import { userInfoContext } from '../../App';
import userInfoContext from '../utils/UserInfoContext';
import CouponItem from '../components/CouponItem';

export default function CouponScreen() {
  const { userInfo, setUserInfo } = useContext(userInfoContext);
  const [coupons, setCoupons] = useState([]);
  const [filterCoupons, setFilterCoupon] = useState([]);
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
  /* eslint-enable */
  return (
    <View style={styles.container}>
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
