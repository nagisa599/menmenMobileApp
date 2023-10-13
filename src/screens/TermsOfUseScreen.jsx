import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import Tab from '../components/Tab';

export default function TermsOfUseScreen(props) {
  const { navigation } = props;
  const termsText = `
    利用規約の内容をここに記述します。必要な範囲で改行やスタイリングを適用できます。
    例えば、リスト項目として表示する場合や、太字や斜体を使用する場合など、必要に応じてスタイリングを追加できます。
    以下に利用規約の一部を示します:

    1. 利用規約の内容1
    2. 利用規約の内容2
    3. 利用規約の内容3

    利用規約の最終的な内容に関しては、プロジェクトやアプリの要件に従って適切に記述してください。
  `;

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Tab
          label="戻る"
          onPress={() => {
            navigation.navigate('SettingScreen');
          }}
        />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.termsText}>{termsText}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
  },
  scrollView: {
    flex: 1,
    margin: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  termsText: {
    fontSize: 16,
  },
});
