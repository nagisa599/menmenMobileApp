import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView, ActivityIndicator,
} from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';

import Tab from '../components/Tab';
import myLocalImage from '../../assets/profile.jpg';
import StampCard from '../components/StampCard';

export default function MypageScreen(props) {
  const { navigation } = props;
  const [isImageLoaded, setImageLoaded] = useState(false);

  return (
    <View style={styles.container}>
      { !isImageLoaded && <ActivityIndicator size="large" style={styles.loader} /> }
      <View style={styles.tabContainer}>
        <Tab label="マイページ" onPress={() => {}} active />
        <Tab
          label="設定"
          onPress={() => {
            navigation.navigate('SettingScreen');
          }}
        />
      </View>
      <ScrollView>
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
            <Text style={styles.username}>ラーメンおじじああああああああああああああああ</Text>
            <Text style={styles.userid}>ID: ff938dkg</Text>
          </View>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>好きなラーメン・トッピング</Text>
          <View style={styles.favorite}>
            <View style={styles.ramen}>
              <MaterialIcons name="ramen-dining" size={22} color="black" />
              <Text style={styles.item}>まぜそば</Text>
            </View>
            <View style={styles.topping}>
              <AntDesign name="pluscircleo" size={22} color="black" />
              <Text style={styles.item}>ねぎ</Text>
            </View>
          </View>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>スタンプカード</Text>
          <View style={styles.stamp}>
            <StampCard />
          </View>
        </View>
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
  },
  username: {
    fontSize: 24,
  },
  userid: {
    fontSize: 18,
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
