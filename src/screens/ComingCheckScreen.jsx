import React, { useState, useEffect, useContext } from 'react';
import {
  Text, View, StyleSheet, Alert,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {
  getDoc, getFirestore, doc, setDoc, Timestamp, addDoc, collection,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import userInfoContext from '../utils/UserInfoContext';
import LoadingScreen from './LoadingScreen';

export default function ComingCheckScreen({ navigation }) {
  const { setUserInfo } = useContext(userInfoContext);
  // アプリはカメラを使う許可が認められるかどうか
  const [hasPermission, setHasPermission] = useState(null);
  // アプリはQRコードをスキャンしたかどうか
  const [scanned, setScanned] = useState(false);
  const [todayToken, setTodayToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
      } else {
        console.log('ここでエラー');
      }
    } catch (e) {
      console.log('Firebaseの更新に失敗');
      return e;
    }
    try {
      const newVisitData = {
        userID: auth.currentUser.uid,
        visitDate: Timestamp.fromDate(new Date()), // 現在の日時
      };

      await addDoc(collection(db, 'visits'), newVisitData);
    } catch (e) {
      Alert.alert('通信に失敗しました。アプリを再起動してお試し下さい。');
    }
  }

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned || isLoading) {
      return; // すでにスキャンが完了している場合は何もしない
    }

    setScanned(true); // スキャンが開始されたことを記録
    setIsLoading(true);

    if (todayToken === data) {
      await EatCountCheck();
      Alert.alert('スキャン成功!\n記録しました!');
    } else {
      Alert.alert('不正な来店です');
    }
    setIsLoading(false);
    // 処理が完了したらスキャン状態をリセット
    setTimeout(() => setScanned(false), 3000); // 3秒後にリセット

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* カメラアにクセスすることがまだ許可も拒否もされていない場合 */}
      {hasPermission === null && <Text>カメラの許可を要求しています。</Text>}
      {/* カメラアにクセスすることが拒否されている合 */}
      {hasPermission === false && <Text>カメラにアクセスできません</Text>}
      {/* カメラアにクセスすることが許可されている場合 */}
      {isLoading && (<LoadingScreen content="登録中" />)}
      {hasPermission && (
        <BarCodeScanner
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          onBarCodeScanned={handleBarCodeScanned}
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
