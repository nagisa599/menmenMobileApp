import React, {
  Text, View, Image, StyleSheet,
} from 'react-native';
import { useState, useEffect } from 'react';
import { number, string } from 'prop-types';

import { getFirebaseData } from '../utils/fetchImage';

function Stars({ count }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {Array.from({ length: count }, (_, i) => i).map((_, index) => (
        <Text key={index} style={styles.star}>⭐️</Text>
      ))}
    </View>
  );
}

export default function RamensItem({ ramensId, ramensImageUrl }) {
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
      <Image source={ramensImageUrl ? { uri: ramensImageUrl } : null} style={styles.ramenImage} />
      <Text style={styles.nameText}>
        { ramenInfo.name }
        {' '}
      </Text>
      <Text style={styles.nameText}>
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
    padding: 10,
    alignItems: 'center',
  },
  ramenImage: {
    width: 150,
    height: 150,
    margin: 1,
    borderRadius: 10,
    borderWidth: 1,
  },
  nameText: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
  },
});
