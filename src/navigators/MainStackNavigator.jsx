import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { bool, func } from 'prop-types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AnimatedSplashScreen from '../screens/AnimatedSplashScreen';
import MypageScreen from '../screens/MypageScreen';
import ComingCheckScreen from '../screens/ComingCheckScreen';
import MainTabs from './TabScreen';
import InquiryScreen from '../screens/InqueryScreen';
import TermsOfUseScreen from '../screens/TermsOfUseScreen';
import EditUserInfoScreen from '../screens/EditUserInfoScreen';
import userInfoContext from '../utils/UserInfoContext';
import Message from '../components/Home/Message';
import Calendar from '../components/Home/Calendar';

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

function MyheaderRight({ navigation }) {
  const { userInfo } = useContext(userInfoContext);
  const iconColor = userInfo.visited ? '#ccc' : '#000';
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ComingCheck')}
      disabled={userInfo.visited}
    >
      <Ionicons
        name="qr-code-outline"
        size={24}
        color={iconColor}
      />
    </TouchableOpacity>
  );
}

export default function MainStackNavigator({ isSplashVisible, setSplashVisible }) {
  const navigation = useNavigation();
  const { userInfo } = useContext(userInfoContext);
  if (isSplashVisible) {
    return <AnimatedSplashScreen setSplashVisible={setSplashVisible} />;
  }

  return (
    <Stack.Navigator initialRouteName="MainTabs">
      <Stack.Screen
        name="Men Men"
        component={MainTabs}
        options={{
          headerTitleAlign: 'center',
          // eslint-disable-next-line react/no-unstable-nested-components
          headerLeft: () => {
            if (userInfo.name !== 'notLogin') {
              return <MyheaderLeft navigation={navigation} />;
            }
            return null;
          },
          // eslint-disable-next-line react/no-unstable-nested-components
          headerRight: () => {
            if (userInfo.name !== 'notLogin') {
              return <MyheaderRight navigation={navigation} />;
            }
            return null;
          },
          headerTitleStyle: {
            fontSize: 24,
            fontFamily: Platform.OS === 'ios' ? 'Arial' : 'Roboto',
          },
        }}
      />
      <Stack.Screen name="MypageScreen" component={MypageScreen} options={{ headerTitle: 'マイページ' }} />
      <Stack.Screen name="ComingCheck" component={ComingCheckScreen} options={{ headerTitle: 'QRコード読み取り' }} />
      <Stack.Screen name="InquiryScreen" component={InquiryScreen} options={{ headerTitle: 'お問い合わせ' }} />
      <Stack.Screen name="TermsOfUseScreen" component={TermsOfUseScreen} options={{ headerTitle: '利用規約' }} />
      <Stack.Screen name="EditUserInfoScreen" component={EditUserInfoScreen} options={{ headerTitle: 'プロフィール編集' }} />
      <Stack.Screen name="Message" component={Message} options={{ headerTitle: 'コールについて' }} />
      <Stack.Screen name="Calendar" component={Calendar} options={{ headerTitle: '営業カレンダー' }} />
    </Stack.Navigator>
  );
}

MainStackNavigator.propTypes = {
  isSplashVisible: bool.isRequired,
  setSplashVisible: func.isRequired,
};
