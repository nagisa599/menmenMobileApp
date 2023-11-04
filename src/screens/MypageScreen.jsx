/* eslint-disable no-irregular-whitespace */
import React, { useContext, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView, TouchableOpacity,
} from 'react-native';

import StampCard from '../components/StampCard';
import Generator from '../components/Generator';
import CircleTitle from '../components/CircleTitle';
import userInfoContext from '../utils/UserInfoContext';
import { ChangeIDtoName } from '../utils/Data';
import LoadingScreen from './LoadingScreen';

export default function MypageScreen(props) {
  const { navigation } = props;
  const { userInfo } = useContext(userInfoContext);
  const [ramenName, setRamenName] = useState('');
  const [toppingName, setToppingName] = useState('');
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const ramen = await ChangeIDtoName(userInfo.ramen);
      const topping = await ChangeIDtoName(userInfo.topping);
      setRamenName(ramen);
      setToppingName(topping);
      setLoading(false);
    })();
  }, [userInfo.ramen, userInfo.topping]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.listContainer}>
        <TouchableOpacity
          style={styles.maininfo}
          onPress={() => {
            navigation.navigate('EditUserInfoScreen');
          }}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: userInfo.imageUrl }}
              style={styles.icon}
            />
          </View>
          <View style={styles.circleImage}>
            {userInfo.title != null && (
              <CircleTitle title={userInfo.title} />
            )}
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.username}>{userInfo.name}</Text>
            <Text style={styles.subtitle}>
              好きなラーメン　:
              {' '}
              <Text style={styles.highlightedText}>{ramenName}</Text>
            </Text>
            <Text style={styles.subtitle}>
              好きなトッピング:
              {' '}
              <Text style={styles.highlightedText}>{toppingName}</Text>
            </Text>
          </View>
          <Text style={styles.changeIcon}>{'>'}</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <View style={styles.titleContainer}>
          <View style={styles.stamp}>
            <StampCard />
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
  highlightedText: {
    color: 'black',
    fontWeight: 'bold',
  },
});
