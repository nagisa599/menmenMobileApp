import React, { useContext, useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  View, StyleSheet, ScrollView, Text,
} from 'react-native';
import {
  getDocs, collection, query, getDoc, doc, where,
} from 'firebase/firestore';
import db from '../../firebaseConfig';

// import { userInfoContext } from '../../App';
import userInfoContext from '../utils/UserInfoContext';
import CouponItem from '../components/CouponItem';

export default function CouponScreen() {
  const { userInfo } = useContext(userInfoContext);
  const [coupons, setCoupons] = useState([]);
  const [filterCoupons, setFilterCoupon] = useState([]);
  const [couponFlag, setCouponFlag] = useState(true);
  // ログインしているかのチェック（最初のアクセスのみ発火)
  useEffect(() => {
    if (userInfo.name !== 'notLogin') {
      fetchData();
    } else {
      // Alert.alert(
      //   'こちらのサービスを利用するには、ログインが必要です',
      //   '',
      //   [
      //     {
      //       text: 'OK',
      //       onPress: () => {
      //         setUserInfo(null);
      //       },
      //     },
      //   ],
      // );
      setCouponFlag(false);
    }
  }, []);

  // Userに基づいたクーポンの取得
  const fetchData = async () => {
    try {
      const myCoupons = [];
      const ref = query(collection(db, `users/${userInfo.uid}/hasCoupons`), where('used', '==', false));
      const querySnapshot = await getDocs(ref);
      console.log(querySnapshot);
      if (!querySnapshot.empty) {
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
            setCouponFlag(false);
          }
        }));
        setCoupons(myCoupons);
        const firstSetCoupons = myCoupons.filter((coupon) => coupon.used === false);
        setFilterCoupon(firstSetCoupons);
      } else {
        setCouponFlag(false);
      }
    } catch (error) {
      setCouponFlag(false);
    }
  };
  /* eslint-enable */
  return (
    <View style={styles.container}>
      {couponFlag ? ( // couponFlagがtrueの場合
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
      ) : ( // couponFlagがfalseの場合
        <View style={styles.noCouponContainer}>
          <MaterialCommunityIcons name="ticket" size={150} color="orange" />
          <View style={styles.noTextContainer}>
            <Text style={styles.noCouponText}>
              ただいま配信されているクーポンがないか、クーポン情報が正しく取得できませんでした。最新のクーポンを取得したい場合は、アプリの再起動をお願いします。
            </Text>
            <Text style={styles.noCouponText}>
              ※会員登録やログインをされていない場合は、クーポンが利用することができません。
            </Text>
          </View>
        </View>
      )}
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
  noCouponContainer: {
    flex: 1,
    alignItems: 'center', // 水平方向の中央寄せ
    marginTop: 80,
  },
  noCouponText: {
    fontSize: 16,
    marginTop: 30,
  },
  noTextContainer: {
    width: '80%',

  },
});
