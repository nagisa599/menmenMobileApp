import React, {
  Text, View, Image, StyleSheet,
} from 'react-native';
import { useState, useEffect } from 'react';
import { number, string } from 'prop-types';
import { Fontisto } from '@expo/vector-icons';

import { getFirebaseData } from '../utils/fetchImage';

function Stars({ count }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {Array.from({ length: count }, (_, i) => i).map((index) => (
        <Fontisto name="star" size={22} color="gold" key={index} />
      ))}
    </View>
  );
}

export default function RamensItem({
  ramensId, ramensImageUrl, imageStyle, textStyle,
}) {
  const [ramenInfo, setRamenInfo] = useState({ name: '', price: 0, favorite: 0 });
  useEffect(() => {
    const fetchData = async () => {
      const ramenData = await getFirebaseData('ramens', ramensId);
      if (ramenData) {
        const { name, price, favorite } = ramenData;
        setRamenInfo({ name, price, favorite });
      }
    };
    fetchData();
  }, [ramensId]);

  return (
    <View style={styles.ramenContainer}>
      <Image
        source={ramensImageUrl ? { uri: ramensImageUrl } : null}
        style={[styles.ramenImage, imageStyle]}
      />
      <Text style={[styles.nameText, textStyle]}>
        { ramenInfo.name }
      </Text>
      <Text style={[styles.nameText, textStyle]}>
        { ramenInfo.price }
        円
      </Text>
      <Stars count={ramenInfo.favorite} />
    </View>
  );
}

Stars.propTypes = {
  count: number.isRequired,
};
RamensItem.propTypes = {
  ramensId: string.isRequired,
  ramensImageUrl: string.isRequired,

};

const styles = StyleSheet.create({
  ramenContainer: {
    padding: 5,
    alignItems: 'center',
  },
  ramenImage: {

  },
  nameText: {
    fontWeight: 'bold',
  },
});
