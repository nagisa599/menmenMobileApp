import React, { useContext, useEffect, useState } from 'react';
import {
  View, StyleSheet, Text, TextInput, ScrollView, TouchableOpacity,
  Alert, TouchableWithoutFeedback, Keyboard,
} from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  doc, getDoc, setDoc, getDocs, collection, deleteDoc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import {
  getStorage, ref, getDownloadURL, uploadBytesResumable,
} from 'firebase/storage';

import * as FileSystem from 'expo-file-system';
import db from '../../firebaseConfig';
import DropdownSelect from '../components/InputForm/DropdownSelect';
import userInfoContext from '../utils/UserInfoContext';
import LoadingScreen from './LoadingScreen';
import ProfileImageUpload from '../components/ProfileImageUpload';
import createImagesDirectory from '../utils/createImagesDirectory';
import { getDownloadedImageUri } from '../utils/DownloadImage';
import errorMessage from '../utils/ErrorFormat';

export default function EditUserInfoScreen(props) {
  const { navigation } = props;
  const { userInfo, setUserInfo } = useContext(userInfoContext);
  const [name, setName] = useState(userInfo.name);
  const [ramen, setRamen] = useState(userInfo.ramen);
  const [topping, setTopping] = useState(userInfo.topping);
  const [updatedAt, setUpdatedAt] = useState(new Date());
  const [isUnique, setIsUnique] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [ramenItems, setRamenItems] = useState([]);
  const [toppingItems, setToppingItems] = useState([]);
  const [image, setImage] = useState(getDownloadedImageUri(userInfo.imageUrl));
  const [isRegistering, setIsRegistering] = useState(false);

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

  useEffect(() => {
    navigation.setOptions({
      headerShown: !(isLoading || isRegistering),
    });
  }, [isLoading, isRegistering, navigation]);

  const isUsernameUnique = async (username) => {
    const userSnap = await getDoc(doc(db, `username/${username}`));
    return !userSnap.exists();
  };

  const checkUsername = async (username) => {
    const unique = await isUsernameUnique(username);
    setIsUnique(unique);
  };

  const handleRegister = async (userData) => {
    setIsRegistering(true);
    // eslint-disable-next-line no-unused-vars
    const auth = getAuth();
    const storage = getStorage();

    if (!userData) {
      errorMessage('ユーザーデータが存在しません');
      return;
    }

    if (!isUnique) {
      errorMessage('ユーザー名がすでに使われています\n 変更してください');
      return;
    }

    if (!name.trim()) {
      errorMessage('ユーザー名を入力してください');
      return;
    }

    const userDoc = doc(db, `users/${userData.uid}`);
    setUpdatedAt(new Date());

    const uriToBlob = async (uri) => {
      if (!uri) {
        throw new Error('URIが無効です');
      }
      try {
        const response = await fetch(uri);
        if (!response.ok) {
          throw new Error('画像の取得に失敗');
        }
        const blob = await response.blob();
        if (!(blob instanceof Blob)) {
          throw new Error('有効なBlobオブジェクトが取得できませんでした');
        }
        return blob;
      } catch (error) {
        errorMessage('画像の読み込みに失敗しました', error);
        throw new Error('画像の読み込みに失敗しました');
      }
    };

    let { imageUrl } = userInfo;
    if (image) {
      try {
        const imageBlob = await uriToBlob(image);
        const storageRef = ref(storage, `users/${userData.uid}`);

        await uploadBytesResumable(storageRef, imageBlob);

        imageUrl = await getDownloadURL(storageRef);
      } catch (error) {
        errorMessage('画像のアップロードに失敗しました', error);
        return;
      }
    }

    await createImagesDirectory('user');
    const relativePath = `user/${auth.currentUser.uid}`;
    const downloadDest = `${FileSystem.documentDirectory}${relativePath}`;
    const downloadResult = await FileSystem.downloadAsync(imageUrl, downloadDest);

    if (downloadResult.status !== 200) {
      console.error('Error downloading the image:', downloadResult);
    }

    try {
      setUserInfo({
        ...userData,
        name,
        ramen,
        topping,
        updatedAt,
        imageUrl: relativePath,
      });
      const deleteTask = deleteDoc(doc(db, `username/${userInfo.name}`));
      const setUserTask = setDoc(userDoc, {
        ...userData,
        name,
        ramen,
        topping,
        updatedAt,
        imageUrl,
      });
      const setUsernameTask = setDoc(doc(db, `username/${name}`), {
        uid: userData.uid,
      });
      await Promise.all([deleteTask, setUserTask, setUsernameTask]);

      Alert.alert(
        '変更完了',
        '',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
              setIsRegistering(false);
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  if (isLoading || isRegistering) {
    return <LoadingScreen content={'データ登録中\nしばらくお待ちください'} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
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
              <Text style={styles.item}>お気に入りラーメン</Text>
              <View style={styles.dropdownContainer}>
                {ramenItems && ramenItems.length > 0 ? (
                  <DropdownSelect
                    contentItems={ramenItems}
                    setChange={setRamen}
                    previous={ramen}
                  />
                ) : (
                  <Text>ロード中</Text>
                )}
              </View>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.item}>お気に入りトッピング</Text>
              <View style={styles.dropdownContainer}>
                {toppingItems && toppingItems.length > 0 ? (
                  <DropdownSelect
                    contentItems={toppingItems}
                    setChange={setTopping}
                    previous={topping}
                  />
                ) : (
                  <Text>ロード中</Text>
                )}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    paddingTop: 100,
  },

  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
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
