import React from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, Alert,
} from 'react-native';
import { number, shape } from 'prop-types';

export default function CouponItem(props) {
  const { couponId, style } = props;
  // couponIdからクーポンの情報を取得
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => {
        Alert.alert('このクーポンを本当に使用しますか？');
      }}
    >
      <View style={styles.id}>
        <Text>
          {`クーポンID: ${couponId}`}
        </Text>
      </View>
      <View style={styles.couponContainer}>
        <Text style={styles.title}>誕生日クーポン</Text>
        <Text style={styles.content}>ラーメン2割引！！</Text>
      </View>
    </TouchableOpacity>
  );
}

CouponItem.propTypes = {
  couponId: number.isRequired,
  style: shape(),
};

CouponItem.defaultProps = {
  style: null,
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
