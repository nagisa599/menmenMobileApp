import React from 'react';
import {
  View, StyleSheet, ScrollView,
} from 'react-native';

import Tab from '../components/Tab';
import SettingItem from '../components/SettingItem';

export default function SettingScreen(props) {
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Tab
          label="マイページ"
          onPress={() => {
            navigation.navigate('MypageScreen');
          }}
        />
        <Tab
          label="設定"
          onPress={() => {}}
          active
        />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <SettingItem
          content="ユーザー情報の変更"
          style={styles.item}
          onPress={() => {
            navigation.navigate('EditUserInfoScreen');
          }}
        />
        <SettingItem content="アンケートへの回答" style={styles.item} />
        <SettingItem
          content="お問い合わせ"
          style={styles.item}
          onPress={() => {
            navigation.navigate('InquiryScreen');
          }}
        />
        <SettingItem
          content="利用規約"
          style={styles.item}
          onPress={() => {
            navigation.navigate('TermsOfUseScreen');
          }}
        />
        <SettingItem content="ヘルプ" style={styles.item} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30,
  },
  contentContainer: {
    alignItems: 'center',
  },
  item: {
    padding: 20,
  },
});
