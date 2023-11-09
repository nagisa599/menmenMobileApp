import React, { useState, useEffect, useContext } from 'react';
import {
  Text, View, StyleSheet, Alert,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {
  getDoc, getFirestore, doc, setDoc, Timestamp,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import userInfoContext from '../utils/UserInfoContext';

export default function ComingCheckScreen(props) {
  const { navigation } = props;
  const { setUserInfo } = useContext(userInfoContext);
  // アプリはカメラを使う許可が認められるかどうか
  const [hasPermission, setHasPermission] = useState(null);
  // アプリはQRコードをスキャンしたかどうか
  const [scanned, setScanned] = useState(false);
  const [todayToken, setTodayToken] = useState(null);

  const getJSTDate = () => {
    const now = new Date();
    const options = {
      year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Tokyo',
    };
    return now.toLocaleDateString('ja-JP', options).replace(/\//g, '-');
  };

  // 最初のレンダリングで、カメラの許可を要求する
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    const db = getFirestore();
    const fetchTodayToken = async () => {
      const today = getJSTDate();
      const tokenDoc = await getDoc(doc(db, `tokens/${today}/`));
      if (tokenDoc.exists()) {
        setTodayToken(tokenDoc.data().token);
      }
    };
    fetchTodayToken();
  }, []);

  async function EatCountCheck() {
    const db = getFirestore();
    const auth = getAuth();
    const userPath = `users/${auth.currentUser.uid}/`;
    const userRef = doc(db, userPath);

    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentTimestamp = Timestamp.fromDate(new Date());
        const newTimes = [...userData.times, currentTimestamp];
        setDoc(userRef, {
          ...userData,
          times: newTimes,
          title: userData.title + 1,
          visited: true,
        });
        setUserInfo({
          ...userData,
          times: newTimes,
          title: userData.title + 1,
          visited: true,
        });
      }
    } catch (e) {
      Alert.alert('Firebaseの更新に失敗');
      return e;
    }
  }

  // QRコードがスキャンされると、読み取ったリンクを開く
  // リンクを開く事がでない場合にはメッセージを表示する
  const handleBarCodeScanned = async ({ data }) => {
    if (todayToken === data) {
      await EatCountCheck();
      // activateStamp(getJSTDate());
      navigation.goBack();
      // Alert.alert('記録しました!');
    } else {
      navigation.goBack();
      Alert.alert('不正な来店です');
    }
  };

  return (
    <View style={styles.container}>
      {/* カメラアにクセスすることがまだ許可も拒否もされていない場合 */}
      {hasPermission === null && <Text>カメラの許可を要求しています。</Text>}
      {/* カメラアにクセスすることが拒否されている合 */}
      {hasPermission === false && <Text>カメラにアクセスできません</Text>}
      {/* カメラアにクセスすることが許可されている場合 */}
      {hasPermission && (
        <BarCodeScanner
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          onBarCodeScanned={(scannerResult) => {
            if (!scanned) {
              setScanned(true);
              Alert.alert(
                'スキャン成功',
                '記録しました！',
                [
                  {
                    test: '閉じる',
                    onPress: () => {
                      setScanned(false);
                      handleBarCodeScanned(scannerResult);
                    },
                  },
                ],
              );
            }
          }}
          style={StyleSheet.absoluteFillObject}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'cyan',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 20,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'whitesmoke',
  },
});
