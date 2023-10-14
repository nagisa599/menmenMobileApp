import React, { useContext, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert,
} from 'react-native';
import {
  getFirestore, getDocs, collection, query, where, getDoc, doc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// import { userInfoContext } from '../../App';
import userInfoContext from '../utils/UserInfoContext';
import CouponItem from '../components/CouponItem';
import FilterItem from '../components/FilterItem';

export default function CouponScreen() {
  const { setUserInfo } = useContext(userInfoContext);
  const [coupons, setcoupons] = useState([]);
  const [filter, setFilter] = useState('0');
  const auth = getAuth();
  const checkUser = auth.currentUser;
  useEffect(() => {
    if (checkUser) {
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
  }, [filter]); // 第二引数に空の配列を渡して、コンポーネントがマウントされた時だけ実行されるように設定

  const fetchData = async () => {
    const mycoupons = [];
    try {
      const db = getFirestore();
      const ref = couponFilter();
      const querySnapshot = await getDocs(ref);
      await Promise.all(querySnapshot.docs.map(async (doc2) => { // 全ての非同期初期が終わったら
        const couponid = doc2.id;
        const ref2 = doc(db, 'coupons', couponid);
        const docSnapshot = await getDoc(ref2);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          mycoupons.push({
            id: doc2.id,
            name: data.name,
            content: data.content,
            used: doc2.data().used,
            expireDate: doc2.data().expire.toDate(),
          });
        } else {
          console.log('読み込みデータなし');
        }
      }));
      setcoupons(mycoupons);
    } catch (error) {
      console.error(error);
      Alert.alert('データの読み込みに失敗しました');
    }
  };

  const couponFilter = () => {
    const user = auth.currentUser;
    const db = getFirestore();
    const today = new Date();
    let ref;
    /* eslint-disable */
    switch (filter) {
      case '0':
        ref = query(
          collection(db, `users/${user.uid}/hasCoupons`),
          where('expire', '>', today),
          where('used', '==', false)
        );
        break;
      case '1':
        ref = query(
          collection(db, `users/${user.uid}/hasCoupons`),
          where('expire', '>', today),
          where('expire', '<', new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())),
          where('used', '==', false)
        );
        break;
      case '2':
        ref = query(
          collection(db, `users/${user.uid}/hasCoupons`),
          where('expire', '>', today),
          where('expire', '<', new Date(today.getFullYear(), today.getMonth() + 3, today.getDate())),
          where('used', '==', false)
        );
        break;
      case '3':
        ref = query(
          collection(db, `users/${user.uid}/hasCoupons`),
          where('used', '==', true)
        );
        break;
      
    };
    return ref;
    
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
        {coupons.map((coupon) => (
          <CouponItem coupon={coupon} key={coupon.name} />
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
