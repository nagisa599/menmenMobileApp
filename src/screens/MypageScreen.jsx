import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity,
} from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

import myLocalImage from '../../assets/profile.jpg';
import StampCard from '../components/StampCard';
import Loading from '../components/Loading';
import Generator from '../components/Generator';
import { ChangeIDtoName, convertFirestoreTimestampToDate, formatDateToYYYYMMDD } from '../utils/Data';
import CircleTitle from '../components/CircleTitle';

export default function MypageScreen(props) {
  const { navigation } = props;
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [visited, setVisited] = useState(true);

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
            let comingData = [];

            if (userData.times && userData.times.length > 0) {
              lastVisitDate = userData.times[userData.times.length - 1];
              lastVisitDate = convertFirestoreTimestampToDate(lastVisitDate);
              lastVisitDate = formatDateToYYYYMMDD(lastVisitDate);
              comingData = userData.times;
            }

            const today = formatDateToYYYYMMDD(new Date());

            if (lastVisitDate === today) {
              setVisited(true);
            } else {
              setVisited(false);
            }

            const formattedDates = comingData.map((data) => {
              const date = convertFirestoreTimestampToDate(data);
              return formatDateToYYYYMMDD(date);
            });

            setUserInfo({
              userName: userData.name,
              userRamen: ramenName,
              userTopping: toppingName,
              visited: formattedDates,
            });
          } else {
            console.log('ユーザー情報がない');
          }
          setLoading(false);
        } catch (e) {
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
      <ScrollView style={styles.listContainer}>
        <TouchableOpacity
          style={styles.maininfo}
          onPress={() => {
            navigation.navigate('EditUserInfoScreen');
          }}
        >
          <View style={styles.imageContainer}>
            <Image
              source={myLocalImage}
              style={styles.icon}
              onLoad={() => {
                setImageLoaded(true);
              }}
            />
          </View>
          <View style={styles.circleImage}>
            <CircleTitle />
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.username}>{userInfo.userName}</Text>
            <Text style={styles.subtitle}>{`users/${userInfo.userRamen}/`}</Text>
            <Text style={styles.subtitle}>好きなトッピング</Text>
          </View>
          <Text style={styles.changeIcon}>{'>'}</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <View style={styles.titleContainer}>

          <View style={styles.stamp}>
            {!isLoading && (
            <StampCard
              userVisited={userInfo.visited}
            />
            )}
          </View>
        </View>
        <View style={styles.separator} />
        <View>
          <Text style={styles.otherText}>その他</Text>
          <TouchableOpacity
            style={styles.otherinfo}
            onPress={() => {
              navigation.navigate('TermsOfUseScreen');
            }}
          >
            <View style={styles.otherContainer}>
              <Text style={styles.othername}>利用規約</Text>
            </View>
            <Text style={styles.changeIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.otherinfo}
            onPress={() => {
              navigation.navigate('InquiryScreen');
            }}
          >
            <View style={styles.otherContainer}>
              <Text style={styles.othername}>お問い合わせ</Text>
            </View>
            <Text style={styles.changeIcon}>{'>'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.otherinfo}
            onPress={() => {
              navigation.navigate('InquiryScreen');
            }}
          >
            <View style={styles.otherContainer}>
              <Text style={styles.othername}>ヘルプ</Text>
            </View>
            <Text style={styles.changeIcon}>{'>'}</Text>
          </TouchableOpacity>
        </View>
        <Generator />
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
    paddingTop: 20,
  },
  circleImage: {
    position: 'absolute',
    top: 40,
    left: 30,
  },
  maininfo: {
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  otherinfo: {
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  otherText: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingBottom: 5,
  },
  imageContainer: {
    paddingLeft: 10,
  },
  changeIcon: {
    fontSize: 20,
    paddingRight: 20,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  nameContainer: {
    flex: 1,
    padding: 20,
  },
  otherContainer: {
    flex: 1,
    padding: 10,
  },
  username: {
    fontSize: 30,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(0, 0, 0, 0.5)', // テキストの色を薄くする (0.5 はアルファ値)
  },
  othername: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  titleContainer: {
    marginHorizontal: 30,
    marginTop: 20,
    marginBottom: 20,
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
    marginTop: 10,
  },
  separator: {
    height: 1,
    backgroundColor: 'gray', // 線の色を選択してください
    marginHorizontal: 10,
  },
});
