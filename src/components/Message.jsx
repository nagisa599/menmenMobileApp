import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ToppingTemplate from './ToppingTemplate';

export default function Message() {
  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>&lt;---  注文方法  ---&gt;</Text>
      </View>
      <ToppingTemplate
        toppingName="ニンニク"
        options={
          [
            { id: '1', name: '抜き', explain: '0g' },
            { id: '2', name: '少し', explain: '大さじ半杯' },
            { id: '3', name: 'ニンニク', explain: '大さじ1杯' },
            { id: '4', name: 'ニンニクマシマシ', explain: '大さじ2杯' },
          ]
        }
      />
      <ToppingTemplate
        toppingName="ヤサイ"
        options={
          [
            { id: '1', name: '少なめ', explain: '150g' },
            { id: '2', name: '普通', explain: '300g' },
            { id: '3', name: 'ヤサイ', explain: '450g' },
            { id: '4', name: 'ヤサイ\nマシマシ', explain: '600g' },
          ]
        }
      />
      <ToppingTemplate
        toppingName="アブラ"
        options={
          [
            { id: '1', name: '普通' },
            { id: '2', name: 'アブラ' },
            { id: '3', name: 'アブラ\nマシマシ' },
          ]
        }
      />
      <ToppingTemplate
        toppingName="味の濃さ"
        options={
          [
            { id: '1', name: '普通' },
            { id: '2', name: 'カラメ' },
            { id: '3', name: 'カラカラ' },
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
    fontSize: 20,
  },
});
