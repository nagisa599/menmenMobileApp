import React, { useState } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, Alert,
} from 'react-native';
import {
  string, instanceOf, shape, bool,
} from 'prop-types';
import { getAuth } from 'firebase/auth';
import {
  getFirestore, setDoc, doc,
} from 'firebase/firestore';

export default function CouponItem(props) {
  const [isCouponUsed, setIsCouponUsed] = useState(false);
  const { coupon } = props;
  const formattedDate = new Date(coupon.expireDate).toLocaleString('ja-JP');
  const useCoupon = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const db = getFirestore();
      const ref = doc(db, `users/${user.uid}/hasCoupons`, coupon.id);
      await setDoc(ref, {
        expire: coupon.expireDate,
        used: true,
        usedDate: new Date(),
      });
      setIsCouponUsed(true);
    } catch (error) {
      Alert.alert('クーポンの利用に失敗しました');
    }
  };
  if (isCouponUsed) {
    return null;
  }
  if (coupon.used) {
    return (
      <View style={[styles.container]}>
        <View style={styles.couponContainer}>
          <Text style={styles.title}>{`${coupon.name}（使用済み)`}</Text>
          <Text style={styles.content}>{coupon.content}</Text>
          <Text style={styles.content}>{`有効期限 ${formattedDate}`}</Text>
        </View>
      </View>
    );
  }
  // couponIdからクーポンの情報を取得
  return (
    <TouchableOpacity
      style={[styles.container]}
      onPress={() => {
        Alert.alert(
          'クーポンを利用しますか？',
          '',
          [
            {
              text: 'キャンセル',
              style: 'cancel',
            },
            {
              text: '利用する',
              onPress: () => {
                useCoupon();
                Alert.alert('クーポンを使用しました！');
              },
            },
          ],
        );
      }}
    >
      <View style={styles.couponContainer}>
        <Text style={styles.title}>{coupon.name}</Text>
        <Text style={styles.content}>{coupon.content}</Text>
        <Text style={styles.content}>{`有効期限 ${formattedDate}まで`}</Text>
      </View>
    </TouchableOpacity>
  );
}
CouponItem.propTypes = {
  coupon: shape({
    name: string,
    content: string,
    expireDate: instanceOf(Date),
    id: string,
    used: bool,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 30,
    width: '80%',
    paddingVertical: 20,
    marginVertical: 20,
  },
  id: {
    position: 'absolute',
    left: 30,
  },
  couponContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    marginVertical: 20,
  },
  content: {
    fontSize: 20,
  },
});
