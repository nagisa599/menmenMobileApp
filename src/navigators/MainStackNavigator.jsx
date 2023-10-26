import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { bool, func } from 'prop-types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AnimatedSplashScreen from '../screens/AnimatedSplashScreen';
import MypageScreen from '../screens/MypageScreen';
import ComingCheckScreen from '../screens/ComingCheckScreen';
import Generator from '../components/Generator';
import MainTabs from './TabScreen';

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

export default function MainStackNavigator({ isSplashVisible, setSplashVisible }) {
  const navigation = useNavigation();
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
