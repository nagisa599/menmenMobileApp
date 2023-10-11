import React from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, Alert,
} from 'react-native';
import { string, instanceOf, shape } from 'prop-types';

export default function CouponItem(props) {
  const { coupon } = props;
  const formattedDate = new Date(coupon.expireDate).toLocaleString('ja-JP');
  console.log(formattedDate);

  // couponIdからクーポンの情報を取得
  return (
    <TouchableOpacity
      style={[styles.container]}
      onPress={() => {
        Alert.alert('このクーポンを本当に使用しますか？');
      }}
    >
      <View style={styles.id}>
        <Text>
          {`クーポンID: ${coupon.name}`}
        </Text>
      </View>
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
