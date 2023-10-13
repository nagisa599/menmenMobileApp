import React, { useState, useEffect } from 'react';
import {
  Text, View, StyleSheet, Pressable, Alert,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function ComingCheckScreen() {
  // アプリはカメラを使う許可が認められるかどうか
  const [hasPermission, setHasPermission] = useState(null);
  // アプリはQRコードをスキャンしたかどうか
  const [scanned, setScanned] = useState(false);

  // 最初のレンダリングで、カメラの許可を要求する
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // QRコードがスキャンされると、読み取ったリンクを開く
  // リンクを開く事がでない場合にはメッセージを表示する
  const handleBarCodeScanned = ({ data }) => {
    // console.log(data);
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
                'スキャン結果',
                scannerResult.data,
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
      {/* スキャンが終わってから表示する */}
      {scanned && (
        <Pressable onPress={() => setScanned(false)} style={styles.button}>
          <Text style={styles.text}>別のQRコードを読み取る</Text>
        </Pressable>
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
