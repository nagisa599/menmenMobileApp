import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, Pressable,
} from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import QRCode from 'react-native-qrcode-svg';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

export default function Generator() {
  const [qrCodeValue, setQrCodeValue] = useState('');

  useEffect(() => {
    const fetchTokenFromFirebase = async () => {
      const db = getFirestore();
      const today = new Date();
      const formatedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const tokenDoc = await getDoc(doc(db, 'tokens', formatedDate));

      if (tokenDoc.exists) {
        setQrCodeValue(tokenDoc.data().token);
      } else {
        alert('トークンが存在しません');
      }
    };

    fetchTokenFromFirebase();
  }, []);

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>バーコードを表示する</Text>
      </Pressable>
      {qrCodeValue ? <QRCode value={qrCodeValue} /> : <Text>トークンを読み込み中...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    marginHorizontal: 12,
    marginVertical: 20,
    borderWidth: 1,
    padding: 10,
    width: 200,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: 'cyan',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 40,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'whitesmoke',
  },
});
