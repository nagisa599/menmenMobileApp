import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { number } from 'prop-types';
import logoImage1 from '../../assets/FIRST.png';
import logoImage2 from '../../assets/SECOND.png';
import logoImage3 from '../../assets/THIRD.png';
import logoImage4 from '../../assets/FOUR.png';
import logoImage5 from '../../assets/FIVE.png';

export default function CircleTitle({ title }) {
  const getImageAndStyle = () => {
    if (title > 12) return { image: logoImage5, style: styles.logo1 };
    if (title > 8) return { image: logoImage4, style: styles.logo1 };
    if (title > 4) return { image: logoImage3, style: styles.logo1 };
    if (title > 0) return { image: logoImage2, style: styles.logo1 };
    return { image: logoImage1, style: styles.logo1 };
  };

  const { image, style } = getImageAndStyle();

  return (
    <View style={styles.header}>
      <Image source={image} style={style} />
    </View>
  );
}

CircleTitle.propTypes = {
  title: number.isRequired,
};

const styles = StyleSheet.create({
  logo1: {
    width: 80,
    height: 80,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
