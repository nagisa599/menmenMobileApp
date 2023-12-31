import React, { useEffect, useState, useContext } from 'react';
import {
  View, StyleSheet, Text, TextInput, ScrollView, TouchableOpacity,
  TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import {
  collection,
  doc, getDoc, getDocs, setDoc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import {
  getStorage, ref, getDownloadURL, uploadBytesResumable,
} from 'firebase/storage';

// eslint-disable-next-line import/no-unresolved
import { DEFAULT_IMAGE_URL } from '../../env.json';
import userInfoContext from '../utils/UserInfoContext';
import db from '../../firebaseConfig';
import BirthdayInput from '../components/InputForm/BirthdayInput';
import DropdownSelect from '../components/InputForm/DropdownSelect';
import LoadingScreen from './LoadingScreen';
import ProfileImageUpload from '../components/ProfileImageUpload';
import errorMessage from '../utils/ErrorFormat';

export default function SignUpScreen() {
  const { userInfo, setUserInfo } = useContext(userInfoContext);
  const [name, setName] = useState('');
  const [birthday, setBirthDay] = useState('');
  const [ramen, setRamen] = useState('');
  const [topping, setTopping] = useState('');
  const [createdAt, setCreatedAt] = useState(new Date());
  const [isUnique, setIsUnique] = useState(true);
  const [ramenItems, setRamenItems] = useState([]);
  const [toppingItems, setToppingItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // お気に入りラーメンやトッピングのリスト作成のためのuseEffect
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

  // ユーザー名が固有かどうかFirebaseに確認
  const isUsernameUnique = async (username) => {
    const userRef = doc(db, `username/${username}`);
    const userSnap = await getDoc(userRef);
    return !userSnap.exists();
  };
  // ユーザー名が固有かどうかチェックし、stateを更新
  const checkUsername = async (username) => {
    const unique = await isUsernameUnique(username);
    setIsUnique(unique);
  };

  // 登録関数
  const handleRegister = async (userData) => {
    setIsRegistering(true);
    // eslint-disable-next-line no-unused-vars
    const auth = getAuth();
    const storage = getStorage();

    if (!userData) {
      errorMessage('ユーザーデータが存在しません');
      setIsRegistering(false);
      return;
    }

    if (!isUnique) {
      errorMessage('ユーザー名がすでに使われています\n 変更してください');
      setIsRegistering(false);
      return;
    }

    if (!name.trim()) {
      errorMessage('ユーザー名を入力してください');
      setIsRegistering(false);
      return;
    }
    if (!birthday.trim()) {
      errorMessage('誕生日を入力してください');
      setIsRegistering(false);
      return;
    }

    const userDoc = doc(db, `users/${userData.uid}`);
    setCreatedAt(new Date());

    const uriToBlob = async (uri) => {
      const response = await fetch(uri);
      const blob = await response.blob();
      return blob;
    };

    let imageUrl = DEFAULT_IMAGE_URL;
    if (image) {
      const imageBlob = await uriToBlob(image);
      const storageRef = ref(storage, `users/${userData.uid}`);
      try {
        await uploadBytesResumable(storageRef, imageBlob);
        imageUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.log('Error uploading image:', error);
      }
    } else {
      const storageRef = ref(storage, 'users/sample.jpg');
      try {
        imageUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.log('initial image cannnot download', error);
      }
    }

    try {
      await setDoc(userDoc, {
        email: userInfo.email,
        uid: userInfo.uid,
        name,
        birthday,
        ramen,
        topping,
        createdAt,
        updatedAt: createdAt,
        times: [],
        visited: false,
        imageUrl,
        title: 0,
        friends: [],
      });

      setUserInfo({
        ...userInfo,
        name,
        birthday,
        ramen,
        topping,
        createdAt,
        updatedAt: createdAt,
        times: [],
        visited: false,
        imageUrl,
        title: 0,
        friends: [],
      });

      await setDoc(doc(db, `username/${name}`), {
        uid: userData.uid,
      });
      await setDoc(doc(db, `email/${userInfo.email}`), {
        uid: userData.uid,
      });
    } catch (error) {
      errorMessage('ユーザー登録に失敗しました', error);
    }
    setIsRegistering(false);
  };

  return (
    <View style={styles.container}>
      {isLoading || isRegistering ? (
        <LoadingScreen content="データ登録中" />
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
                <View styel={styles.itemContainer}>
                  <Text style={styles.item}>プロフィール画像</Text>
                  <ProfileImageUpload image={image} setImage={setImage} />
                </View>
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
                      previous=""
                    />
                  </View>
                </View>
                <View style={styles.itemContainer}>
                  <Text style={styles.item}>お気に入りトッピング</Text>
                  <View style={styles.dropdownContainer}>
                    <DropdownSelect
                      contentItems={toppingItems}
                      setChange={setTopping}
                      previous=""
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
