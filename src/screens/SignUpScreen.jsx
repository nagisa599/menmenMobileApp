import React, { useState } from 'react';
import {
  View, StyleSheet, Text, TextInput, ScrollView,
} from 'react-native';

import BirthdayInput from '../components/BirthdayInput';

const ramenItem = [
  { label: '未登録', value: '0' },
  { label: 'ラーメン', value: '1' },
  { label: 'まぜそば', value: '2' },
  { label: '汁なし', value: '3' },
  { label: 'カレー', value: '4' },
  { label: 'つけ麺', value: '5' },
  { label: 'モクヨージャンク', value: '6' },
];

const toppingItem = [
  { label: '未登録', value: '0' },
  { label: 'チーズ', value: '1' },
  { label: '明太子', value: '2' },
  { label: 'のり', value: '3' },
  { label: 'ねぎ', value: '4' },
  { label: 'うずら', value: '5' },
  { label: '七味', value: '6' },
];

export default function SignUpScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [birthday, setBirthDay] = useState('');
  const [ramen, setRamen] = useState('');
  const [topping, setTopping] = useState('');

  const handleDateChange = (date) => {
    setBirthDay(date);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>新規ユーザー登録</Text>
      </View>
      <ScrollView>
        <View style={styles.itemContainer}>
          <Text style={styles.item}>メールアドレス</Text>
          <TextInput
            value="Gmail Address"
            style={styles.mail}
            autoCapitalize="none"
            editable={false}
          />
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.item}>電話番号</Text>
          <TextInput
            value={phoneNumber}
            style={styles.input}
            onChangeText={(text) => {
              setPhoneNumber(text);
            }}
            autoCapitalize="none"
            placeholder="電話番号"
            textContentType="telephoneNumber"
          />
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.item}>ユーザー名</Text>
          <TextInput
            value={name}
            style={styles.input}
            onChangeText={(text) => {
              setName(text);
            }}
            autoCapitalize="none"
            placeholder="ユーザー名"
            textContentType="username"
          />
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.item}>パスワード</Text>
          <TextInput
            value={password}
            style={styles.input}
            onChangeText={(text) => {
              setPassword(text);
            }}
            autoCapitalize="none"
            placeholder="Password"
            secureTextEntry
            textContentType="password"
          />
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.item}>誕生日</Text>
          <BirthdayInput onDateChange={handleDateChange} />
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.item}>お気に入りラーメン</Text>
          {/* <DropdownItem label="選択" itemList={ramenItem} /> */}
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.item}>お気に入りトッピング</Text>
          {/* <DropdownItem label="選択" itemList={toppingItem} /> */}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    marginBottom: 50,
  },
  titleContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
  },
  mail: {
    fontSize: 16,
    height: 48,
    borderColor: '#DDDDDD',
    backgroundColor: '#D3D3D3',
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  input: {
    fontSize: 16,
    height: 48,
    borderColor: '#DDDDDD',
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  itemContainer: {
    marginBottom: 16,
  },
  item: {
    fontSize: 20,
  },
});
