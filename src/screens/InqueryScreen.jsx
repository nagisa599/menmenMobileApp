import React from 'react';
import {
  View, StyleSheet, Text, Image,
} from 'react-native';
import logoImage from '../../assets/menmen-logo.png'; // ロゴ画像のパスを正しいものに置き換える

export default function InquiryScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImage} style={styles.logo} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>お問い合わせ</Text>
        <Text style={styles.description}>
          お問い合わせ内容についてお知らせください。お手続きに関するご質問やお困りごとがあれば、お気軽にご連絡ください。
        </Text>
        <Text style={styles.contactInfo}>Twitter: @example_twitter</Text>
        <Text style={styles.contactInfo}>電話番号: 012-345-6789</Text>
        <Text style={styles.contactInfo}>メール: info@example.com</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 0,
    paddingTop: 200,
  },
  logo: {
    width: 300, // ロゴ画像の幅
    height: 300, // ロゴ画像の高さ
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  contactInfo: {
    fontSize: 18,
    color: '#007bff',
    marginBottom: 15,
  },
});
