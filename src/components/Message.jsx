import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ToppingTemplate from './ToppingTemplate';

export default function Message() {
  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>&lt;---  注文方法  ---></Text>
      </View>
      <ToppingTemplate
        toppingName="ニンニク"
        options={
          [
            { name: '抜き', explain: '0g' },
            { name: '少し', explain: '大さじ半杯' },
            { name: 'ニンニク', explain: '大さじ1杯' },
            { name: 'ニンニクマシマシ', explain: '大さじ2杯' },
          ]
        }
      />
      <ToppingTemplate
        toppingName="ヤサイ"
        options={
          [
            { name: '少なめ', explain: '150g' },
            { name: '普通', explain: '300g' },
            { name: 'ヤサイ', explain: '450g' },
            { name: 'ヤサイマシマシ', explain: '600g' },
          ]
        }
      />
      <ToppingTemplate
        toppingName="アブラ"
        options={
          [
            { name: '普通' },
            { name: 'アブラ' },
            { name: 'アブラマシマシ' },
          ]
        }
      />
      <ToppingTemplate
        toppingName="味の濃さ"
        options={
          [
            { name: '普通' },
            { name: 'カラメ' },
            { name: 'カラカラ' },
          ]
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
  },
});
