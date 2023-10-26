import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { bool, func } from 'prop-types';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AnimatedSplashScreen from '../screens/AnimatedSplashScreen';
import MypageScreen from '../screens/MypageScreen';
import ComingCheckScreen from '../screens/ComingCheckScreen';
import Generator from '../components/Generator';
import MainTabs from './TabScreen';
import { convertFirestoreTimestampToDate, formatDateToYYYYMMDD } from '../utils/Data';

const Stack = createNativeStackNavigator();

function MyheaderLeft({ navigation }) {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('MypageScreen')}>
      <Ionicons
        name="md-person"
        size={24}
        color="black"
        style={{ marginLeft: 15 }}
      />
    </TouchableOpacity>
  );
}

function MyheaderRight({ navigation, visited, setVisited }) {
  const iconColor = visited ? '#ccc' : '#000';
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ComingCheck', { setVisited })}
      disabled={visited}
    >
      <Ionicons
        name="qr-code-outline"
        size={24}
        color={iconColor}
      />
    </TouchableOpacity>
  );
}

MyheaderRight.propTypes = {
  visited: bool.isRequired,
  setVisited: func.isRequired,
};

export default function MainStackNavigator({ isSplashVisible, setSplashVisible }) {
  const navigation = useNavigation();
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
        try {
          const userDoc = await getDoc(userInfoDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
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
          } else {
            console.log('ユーザー情報がない');
          }
        } catch (e) {
          console.log(e);
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

  if (isSplashVisible) {
    return <AnimatedSplashScreen setSplashVisible={setSplashVisible} />;
  }

  return (
    <Stack.Navigator initialRouteName="MainTabs">
      <Stack.Screen
        name="Men Men"
        component={MainTabs}
        options={{
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => <MyheaderLeft navigation={navigation} />,
          // eslint-disable-next-line react/no-unstable-nested-components
          headerRight: () => (
            <MyheaderRight
              navigation={navigation}
              setVisited={setVisited}
              visited={visited}
            />
          ),
          headerTitleStyle: {
            fontSize: 24,
            fontFamily: 'Arial',
          },
        }}
      />
      <Stack.Screen name="MypageScreen" component={MypageScreen} options={{ headerTitle: 'マイページ' }} />
      <Stack.Screen name="ComingCheck" component={ComingCheckScreen} options={{ headerTitle: 'QRコード読み取り' }} />
      <Stack.Screen name="Generator" component={Generator} options={{ headerTitle: 'QRコード生成' }} />
    </Stack.Navigator>
  );
}

MainStackNavigator.propTypes = {
  isSplashVisible: bool.isRequired,
  setSplashVisible: func.isRequired,
};
