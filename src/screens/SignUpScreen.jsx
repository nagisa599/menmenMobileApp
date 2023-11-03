import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, Text, TextInput, ScrollView, TouchableOpacity,
  Alert, TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import { func, shape } from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  doc, getDoc, getDocs, setDoc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import db from '../../firebaseConfig';
import BirthdayInput from '../components/BirthdayInput';
import DropdownSelect from '../components/DropdownSelect';
import LoadingScreen from './LoadingScreen';

export default function SignUpScreen(props) {
  const { userInfo, setUserInfo } = props;
  const [name, setName] = useState('');
  const [birthday, setBirthDay] = useState('');
  const [ramen, setRamen] = useState(0);
  const [topping, setTopping] = useState(0);
  const [createdAt, setCreatedAt] = useState(new Date());
  const [isUnique, setIsUnique] = useState(true);
  const [ramenItems, setRamenItems] = useState([]);
  const [toppingItems, setToppingItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const ramenItem = [];
      const toppingItem = [];

      const querySnapshot = await getDocs(collection(db, 'ramens'));

      querySnapshot.docs.forEach((menudoc) => {
        const data = menudoc.data();

        const item = {
          label: data.name,
          value: menudoc.id,
        };

        if (data.topping) {
          toppingItem.push(item);
        } else {
          ramenItem.push(item);
        }
      });
      setRamenItems(ramenItem);
      setToppingItems(toppingItem);

      setIsLoading(false);// データのフェッチが完了した後にisLoadingをfalseに設定
    };

    setIsLoading(true);
    fetchData();
  }, []);

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
        times: [],
        visited: false,
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
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
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
                <View>
                  <Text style={styles.item}>プロフィール画像</Text>
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
                    <DropdownSelect
                      contentItems={ramenItems}
                      setChange={setRamen}
                    />
                  </View>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.item}>お気に入りトッピング</Text>
                  <View style={styles.dropdownContainer}>
                    <DropdownSelect
                      contentItems={toppingItems}
                      setChange={setTopping}
                    />
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
        </>
      )}
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
