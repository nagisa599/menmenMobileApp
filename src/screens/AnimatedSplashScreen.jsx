import React, { useEffect, useState } from 'react';
import {
  View, Text, Animated, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import { func } from 'prop-types';
import logo from '../../assets/menmen-logo.png';

function AnimatedSplashScreen(props) {
  const { setSplashVisible } = props;
  const [animation] = useState(new Animated.Value(0));
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched) {
      setSplashVisible(false);
      return; // タッチされたらuseEffectを抜ける
    }

    Animated.timing(animation, {
      toValue: 1,
      duration: 10000, // アニメーションの持続時間（ミリ秒）
      useNativeDriver: false,
    }).start();
  }, [touched]); // touchedが変化したらuseEffectを再実行

  const handleTouch = () => {
    setTouched(true);

    // ここで必要な処理を行う
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleTouch}>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: animation,
            transform: [
              {
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0], // 文字が浮き上がる距離（ピクセル）
                }),
              },
            ],
          },
        ]}
      >
        <Image source={logo} style={styles.logo} />
        <Text style={styles.header}>ラーメン二郎の心構え</Text>
        <View style={styles.ruleContainer}>
          <Text style={styles.rule}>1. 絶対残さず食べるべし</Text>
          <Text style={styles.rule}>2. コールは、大きく言うべし</Text>
          <Text style={styles.rule}>3. 水は自分で組むべし</Text>
          <Text style={styles.rule}>4. 静かに食べるべし</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f2f2f2',
  },
  logo: {
    width: 200, // ロゴの幅を設定
    height: 200, // ロゴの高さを設定
    resizeMode: 'contain', // ロゴのリサイズモードを設定
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  ruleContainer: {
    alignSelf: 'stretch',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  rule: {
    fontSize: 18,
    marginBottom: 10,
  },
});

AnimatedSplashScreen.propTypes = {
  setSplashVisible: func.isRequired,
};
export default AnimatedSplashScreen;
