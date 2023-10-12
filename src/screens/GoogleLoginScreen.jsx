import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { func } from 'prop-types';
import GoogleLoginButton from '../components/GoogleLoginButton';
import AppleLoginButton from '../components/AppleLoginButton';
import NotLoginButton from '../components/NotLoginButton';

import logoImage from '../../assets/menmen-logo.png'; // ロゴ画像のパスを正しいものに置き換える

export default function GoogleLoginScreen({ promptAsync }) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logoImage} style={styles.logo} />
      </View>
      <View style={styles.googleButton}>
        <GoogleLoginButton onPress={() => promptAsync()} />
      </View>
      <View style={styles.button}>
        <AppleLoginButton onPress={() => promptAsync()} />
      </View>
      <View style={styles.marginBottom}>
        <NotLoginButton onPress={() => promptAsync()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#f2f2f2', // 背景色を設定
  },
  logoContainer: {
    backgroundColor: 'rgba(242, 242, 242)',
    borderRadius: 225, // 幅と高さの半分（450 / 2 = 225）に設定することで円形になります
    overflow: 'hidden', // 画像が円形に切り取られるようにする
    marginBottom: 50,
    paddingTop: 30,
  },
  logo: {
    width: 450, // ロゴ画像の幅
    height: 450, // ロゴ画像の高さ
    borderRadius: 1000,
  },
  button: {
    padding: 30,
  },
  googleButton: {
    paddingTop: 0,
  },
  marginBottom: {
    marginBottom: 100,
  },
});

GoogleLoginScreen.propTypes = {
  promptAsync: func.isRequired,
};
