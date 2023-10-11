import React, { useState } from 'react';
import {
  View, StyleSheet, Text, TextInput, ScrollView, TouchableOpacity,
  Alert, TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import { func, shape } from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import db from '../../firebaseConfig';
import BirthdayInput from '../components/BirthdayInput';
import DropdownSelect from '../components/DropdownSelect';

// ramenコレクションの情報に置き換える
const ramenItem = [
  { label: 'ラーメン', value: 1 },
  { label: 'まぜそば', value: 2 },
  { label: '汁なし', value: 3 },
  { label: 'カレー', value: 4 },
  { label: 'つけ麺', value: 5 },
  { label: 'モクヨージャンク', value: 6 },
];

// ramenコレクションの情報に置き換える
const toppingItem = [
  { label: 'チーズ', value: 50 },
  { label: '明太子', value: 51 },
  { label: 'のり', value: 52 },
  { label: 'ねぎ', value: 53 },
  { label: 'うずら', value: 54 },
  { label: '七味', value: 55 },
];

export default function SignUpScreen(props) {
  const { userInfo, setUserInfo } = props;
  const [name, setName] = useState('');
  const [birthday, setBirthDay] = useState('');
  const [ramen, setRamen] = useState(0);
  const [topping, setTopping] = useState(0);
  const [createdAt, setCreatedAt] = useState(new Date());
  const [isUnique, setIsUnique] = useState(true);

  const isUsernameUnique = async (username) => {
    const userRef = doc(db, `username/${username}`);
    const userSnap = await getDoc(userRef);
    return !userSnap.exists();
  };

  const checkUsername = async (username) => {
    const unique = await isUsernameUnique(username);
    setIsUnique(unique);
  };

  const handleRegister = async (userData) => {
    // eslint-disable-next-line no-unused-vars
    const auth = getAuth();

    if (!userData) {
      Alert.alert('ユーザーデータが存在しません');
      return;
    }

    if (!isUnique) {
      Alert.alert('ユーザー名がすでに使われています\n 変更してください');
      return;
    }

    const userUid = userData.uid;
    const userPath = `users/${userUid}`;
    const userDoc = doc(db, userPath);
    setCreatedAt(new Date());

    if (!name.trim()) {
      Alert.alert('ユーザー名を入力してください');
      return;
    }
    if (!birthday.trim()) {
      Alert.alert('誕生日を入力してください');
      return;
    }

    try {
      await setDoc(userDoc, {
        email: userInfo.email,
        name,
        birthday,
        ramen,
        topping,
        createdAt,
      });

      await setDoc(doc(db, `username/${name}`), {
        uid: userUid,
      });

      const combinedUserData = {
        ...userData,
        name,
        birthday,
        ramen,
        topping,
        createdAt,
      };

      await AsyncStorage.setItem('@user', JSON.stringify(combinedUserData));
      setUserInfo(combinedUserData);
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>新規ユーザー登録</Text>
        <Text>
          <Text style={styles.star}>＊</Text>
          は必須項目です
        </Text>
      </View>
      <ScrollView style={{ paddingHorizontal: 30 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>メールアドレス</Text>
              <TextInput
                value={userInfo.email}
                style={styles.mail}
                autoCapitalize="none"
                editable={false}
              />
            </View>
            {/* <View style={styles.itemContainer}>
              <Text style={styles.item}>電話番号</Text>
              <TextInput
                value={phoneNumber}
                style={styles.input}
                onChangeText={(text) => {
                  setPhoneNumber(text);
                }}
                autoCapitalize="none"
                placeholder="電話番号"
                textContentType="telephoneNumber"
              />
            </View> */}
            <View style={styles.itemContainer}>
              <Text style={styles.item}>
                ユーザー名
                <Text style={styles.star}>＊</Text>
              </Text>
              {!isUnique && <Text style={styles.star}>このユーザー名はすでに使われています</Text>}
              <TextInput
                value={name}
                style={styles.input}
                onChangeText={(text) => {
                  checkUsername(text);
                  setName(text);
                }}
                autoCapitalize="none"
                placeholder="ユーザー名"
                textContentType="username"
              />
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>
                誕生日
                <Text style={styles.star}>＊</Text>
              </Text>
              <BirthdayInput onDateChange={setBirthDay} />
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>お気に入りラーメン</Text>
              <View style={styles.dropdownContainer}>
                <DropdownSelect contentItems={ramenItem} setChange={setRamen} />
              </View>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>お気に入りトッピング</Text>
              <View style={styles.dropdownContainer}>
                <DropdownSelect contentItems={toppingItem} setChange={setTopping} />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => handleRegister(userInfo)}
              >
                <Text style={styles.buttonText}>登録</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
}

SignUpScreen.propTypes = {
  userInfo: shape(),
  setUserInfo: func.isRequired,
};

SignUpScreen.defaultProps = {
  userInfo: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
  },
  star: {
    color: 'red',
    fontSize: 14,
  },
  mail: {
    fontSize: 16,
    height: 48,
    borderColor: '#DDDDDD',
    backgroundColor: '#D3D3D3',
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  input: {
    fontSize: 16,
    height: 48,
    borderColor: '#DDDDDD',
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  itemContainer: {
    marginBottom: 16,
  },
  item: {
    fontSize: 20,
  },
  dropdownContainer: {
    alignItems: 'flex-start',
    width: '40%',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
  },
});
