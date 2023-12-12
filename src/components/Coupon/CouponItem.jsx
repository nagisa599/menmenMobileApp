import React, { useContext, useState } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, Alert, Image,
} from 'react-native';
import {
  string, instanceOf, shape, bool, func, arrayOf,
} from 'prop-types';
import {
  setDoc, doc,
} from 'firebase/firestore';
import DottedLine from '../DottedLine';
import db from '../../../firebaseConfig';
import userInfoContext from '../../utils/UserInfoContext';
import couponImage from '../../../assets/hiyashityuka.jpg';

export default function CouponItem(props) {
  const [isCouponUsed, setIsCouponUsed] = useState(false);
  const { coupon, setCoupons, coupons } = props;
  const { userInfo } = useContext(userInfoContext);
  const formattedDate = new Date(coupon.expireDate).toLocaleString('ja-JP');

  // coupon使用メソッド。（クーポンをタップすると発火する。）
  const useCoupon = async () => {
    try {
      setIsCouponUsed(true);
      const ref = doc(db, `users/${userInfo.uid}/hasCoupons`, coupon.id);
      await setDoc(ref, {
        expire: coupon.expireDate,
        used: true,
        usedDate: new Date(),
      });
      setCoupons(coupons.map((preCoupon) => (
        preCoupon.id === coupon.id ? { ...preCoupon, used: true } : preCoupon
      )));
    } catch (error) {
      Alert.alert('クーポンの利用に失敗しました');
    }
  };
  // couponIdからクーポンの情報を取得
  return (
    <View style={[styles.container]}>
      {isCouponUsed && <View style={styles.overlay} />}
      <Image
        source={couponImage}
        style={[styles.couponImage, { opacity: isCouponUsed ? 0.2 : 1.0 }]}
      />
      {isCouponUsed && <Text style={styles.diagonalText}>使用済み</Text>}

      <View style={styles.couponContainer}>
        <Text style={styles.title}>{`${coupon.name}`}</Text>
        <Text style={styles.content}>{coupon.content}</Text>
        <View style={styles.limitContent}>
          <Text style={styles.limitText}>1度に1回まで</Text>
        </View>
        <View>
          <View style={styles.expireContent}>
            <Text style={styles.content}>{`${formattedDate}`}</Text>
            <Text style={styles.textWithPadding}> まで有効</Text>
          </View>
          <DottedLine dotCount={70} />
        </View>
        {!isCouponUsed && (
          <TouchableOpacity
            style={styles.usedButton}
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
            <Text style={styles.usedButtonText}>使用する</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>

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
  coupons: arrayOf(shape({
    name: string,
    content: string,
    expireDate: instanceOf(Date),
    id: string,
    used: bool,
  })).isRequired,
  setCoupons: func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    width: '90%',
    marginVertical: 10,
    backgroundColor: 'white', // 背景色を白に設定
  },
  couponImage: {
    width: '100%',
    height: 150, // クーポンの画像の高さを設定
    marginBottom: 15, // 画像の下の余白
    borderTopLeftRadius: 10, // 下左の角にborderRadiusを適用
    borderTopRightRadius: 10, // 下右の角にborderRadiusを適用
  },
  title: {
    fontWeight: 'bold',

    fontSize: 25, // タイトルのフォントサイズを小さく
    marginBottom: 10, // タイトルの下の余白
    textAlign: 'center', // タイトルを中央に配置
  },
  content: {
    fontSize: 17, // 内容のフォントサイズを小さく
    fontWeight: 'bold', // テキストを太くする
    marginBottom: 10, // 内容の下の余白
    textAlign: 'center', // タイトルを中央に配置
  },
  limitContent: {
    backgroundColor: '#aaa',
    width: '27%',
    borderRadius: 20,
  },
  limitText: {
    padding: 5,
  },
  expireContent: {
    flexDirection: 'row', // 要素を横並びに配置
    paddingTop: 15,
  },
  textWithPadding: {
    paddingTop: 4,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 25, // 価格のフォントサイズを大きく
    color: 'red', // 価格の文字色を赤に設定
  },
  couponUsed: {
    borderTopWidth: 2,
    borderTopColor: '#aaa',
    borderBottomWidth: 2,
    borderBottomColor: '#aaa',
    marginTop: 5,
    marginBottom: 5,
    borderStyle: 'dotted', // これを追加して点線にする
  },
  usedButton: {
    marginTop: 0,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#FFCC00',
    alignItems: 'center',
    borderBottomLeftRadius: 10, // 下左の角にborderRadiusを適用
    borderBottomRightRadius: 10, // 下右の角にborderRadiusを適用
  },
  usedButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    borderBottomWidth: 10,
    borderBottomColor: '#ddd',
    borderBottomStyle: 'dashed', // Use dashed border style
    marginVertical: 10,
  },
  diagonalText: {
    padding: 50,
    paddingLeft: 70,
    position: 'absolute',
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white', // 使用済みのテキスト色。必要に応じて変更
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 1.0)', // 黒ベースの半透明なオーバーレイ
    borderTopLeftRadius: 10, // 下左の角にborderRadiusを適用
    borderTopRightRadius: 10, // 下右の角にborderRadiusを適用
    height: 150, // クーポンの画像の高さを設定
  },
});
