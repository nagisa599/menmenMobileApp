import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ToppingTemplate from './ToppingTemplate';

export default function Message() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.titlewrapper}>
          <Text style={styles.title}>ニンニク入れますか？と聞かれたら</Text>
        </View>
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
  container: {
    marginVertical: 20,
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
  },
  titlewrapper: {
    backgroundColor: '#FFAD90',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
