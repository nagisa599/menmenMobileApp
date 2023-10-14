import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { number } from 'prop-types';
import logoImage1 from '../../assets/FIRST.png';
import logoImage2 from '../../assets/SECOND.png';
import logoImage3 from '../../assets/THIRD.png';
import logoImage4 from '../../assets/FOUR.png';
import logoImage5 from '../../assets/FIVE.png';

export default function CircleTitle(props) {
  const { title } = props;
  console.log(title);
  if (title === 0) {
    return (
      <View style={styles.header}>
        <Image source={logoImage1} style={styles.logo1} />
      </View>
    );
  }
  if (title > 12) {
    return (
      <View style={styles.header}>
        <Image source={logoImage5} style={styles.logo5} />
      </View>
    );
  }
  if (title > 8) {
    return (
      <View style={styles.header}>
        <Image source={logoImage4} style={styles.logo4} />
      </View>
    );
  }
  if (title > 4) {
    return (
      <View style={styles.header}>
        <Image source={logoImage3} style={styles.logo3} />
      </View>
    );
  }
  if (title > 0) {
    return (
      <View style={styles.header}>
        <Image source={logoImage2} style={styles.logo2} />
      </View>
    );
  }
}

CircleTitle.propTypes = {
  title: number.isRequired,
};

const styles = StyleSheet.create({
  logo1: {
    width: 290, // ロゴ画像の幅
    height: 350, // ロゴ画像の高さ
  },
  logo2: {
    width: 330,
    height: 330,
  },
  logo3: {
    width: 280,
    height: 280,
  },
  logo4: {
    width: 240,
    height: 360,
  },
  logo5: {
    width: 240,
    height: 280,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    paddingTop: 200,
    paddingBottom: 150,
  },
});
