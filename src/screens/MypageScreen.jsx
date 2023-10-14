import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView,
} from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import Tab from '../components/Tab';
import myLocalImage from '../../assets/profile.jpg';
import StampCard from '../components/StampCard';
import Loading from '../components/Loading';
import Generator from '../components/Generator';

export default function MypageScreen(props) {
  const { navigation } = props;
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [visited, setVisited] = useState(true);

  const ChangeIDtoName = async (id) => {
    const db = getFirestore();

    const ramenPath = `ramens/${id}/`;
    const ref = doc(db, ramenPath);

    try {
      const ramenDoc = await getDoc(ref);
      if (ramenDoc.exists()) {
        const ramenData = ramenDoc.data();
        return ramenData.name;
      }
      console.log('メニュー情報がありません');
    } catch (error) {
      console.log('refが不正です');
    }
    return null;
  };

  function convertFirestoreTimestampToDate(timestamp) {
    const milliseconds = (timestamp.seconds * 1000) + (timestamp.nanoseconds / 1000000);
    return new Date(milliseconds);
  }

  function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    // マイページ開く際にFirebaseの認証状態が完全に復元されてないとエラーが起きるためonAuthStateChangedで監視する
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const currentUserUid = user.uid;
        const userPath = `users/${currentUserUid}/`;
        const userInfoDocRef = doc(db, userPath);
        setLoading(true);
        try {
          const userDoc = await getDoc(userInfoDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();

            const ramenName = await ChangeIDtoName(userData.ramen);
            const toppingName = await ChangeIDtoName(userData.topping);

            let lastVisitDate = null;

            if (userData.times && userData.times.length > 0) {
              lastVisitDate = userData.times[userData.times.length - 1];
              lastVisitDate = convertFirestoreTimestampToDate(lastVisitDate);
              lastVisitDate = formatDateToYYYYMMDD(lastVisitDate);
            }

            const today = formatDateToYYYYMMDD(new Date());

            if (lastVisitDate === today) {
              setVisited(true);
            } else {
              setVisited(false);
            }

            setUserInfo({
              userName: userData.name,
              userRamen: ramenName,
              userTopping: toppingName,
            });
          } else {
            console.log('ユーザー情報がない');
          }
          setLoading(false);
        } catch (e) {
          console.log('error:', e);
          setLoading(false);
        }
      } else {
        console.log('ユーザーはログインしていません');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
  }, [visited]);

  return (
    <View style={styles.container}>
      <Loading isLoading={isLoading} isImageLoaded={isImageLoaded} />
      <View style={styles.tabContainer}>
        <Tab label="マイページ" onPress={() => {}} active />
        <Tab
          label="設定"
          onPress={() => {
            navigation.navigate('SettingScreen');
          }}
        />
      </View>
      <ScrollView style={styles.listContainer}>
        <View style={styles.maininfo}>
          <View>
            <Image
              source={myLocalImage}
              style={styles.icon}
              onLoad={() => {
                setImageLoaded(true);
              }}
            />
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.username}>{userInfo.userName}</Text>
          </View>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>好きなラーメン・トッピング</Text>
          <View style={styles.favorite}>
            <View style={styles.ramen}>
              <MaterialIcons name="ramen-dining" size={22} color="black" />
              <Text style={styles.item}>{userInfo.userRamen}</Text>
            </View>
            <View style={styles.topping}>
              <AntDesign name="pluscircleo" size={22} color="black" />
              <Text style={styles.item}>{userInfo.userTopping}</Text>
            </View>
          </View>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>スタンプカード</Text>
          <View style={styles.stamp}>
            <StampCard visited={visited} setVisited={setVisited} />
          </View>
        </View>
        <Generator />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>称号</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30,
    backgroundColor: 'rgb(242, 242, 242)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.10,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listContainer: {
    paddingTop: 30,
  },
  maininfo: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
  },
  icon: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  nameContainer: {
    flex: 1,
    marginLeft: 20,
    alignItems: 'center',
  },
  username: {
    fontSize: 28,
  },
  titleContainer: {
    marginHorizontal: 30,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    textDecorationLine: 'underline',
  },
  favorite: {
    paddingTop: 20,
    flexDirection: 'row',
  },
  ramen: {
    marginLeft: 50,
    flexDirection: 'row',
  },
  topping: {
    marginLeft: 50,
    flexDirection: 'row',
  },
  item: {
    fontSize: 18,
  },
  stamp: {
    marginTop: 30,
  },
});
