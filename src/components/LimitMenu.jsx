import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, Text, Image,
} from 'react-native';
import {
  getDownloadURL, getStorage, ref,
} from 'firebase/storage';
import {
  arrayOf, shape, string, number, bool,
} from 'prop-types';

export default function LimitMenu(props) {
  const storage = getStorage();
  const { menus } = props;
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const fetchMenuImages = async () => {
      const menuImagesPromises = menus.map(async (menu) => {
        const imageRef = ref(storage, menu.imageURL);
        try {
          const url = await getDownloadURL(imageRef);
          return url;
        } catch (error) {
          console.error('Error getting download URL: ', error);
          return null;
        }
      });

      // すべての非同期処理が完了した後に実行
      Promise.all(menuImagesPromises)
        .then((urls) => {
          setImageUrls(urls.filter((url) => url !== null));
        })
        .catch((error) => {
          console.error('Error fetching menu images: ', error);
        });
    };

    fetchMenuImages();
  }, [menus]);

  function renderStars(favoriteCount) {
    return Array(favoriteCount).fill('⭐️').join('');
  }

  return (
    <View style={styles.container}>
      {menus.map((menu, index) => (
        <View key={menu.name} style={styles.menuBox}>
          <View>
            <Image source={{ uri: imageUrls[index] }} style={styles.menuPicture} />
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{menu.name}</Text>
            <Text style={styles.item}>{`￥${menu.price}`}</Text>
            <Text style={styles.item}>{menu.student ? '学割対象' : '学割対象外'}</Text>
            <Text style={styles.item}>{`人気度: ${renderStars(menu.favorite)}`}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

LimitMenu.propTypes = {
  menus: arrayOf(
    shape({
      id: string,
      name: string,
      imageURL: string,
      price: number,
      student: bool,
      favorite: number,
    })
  ).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuBox: {
    paddingVertical: 20,
    width: '65%',
  },
  menuPicture: {
    height: 200,
    width: '100%',
  },
  info: {
    alignItems: 'flex-end',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  item: {
    fontSize: 16,
  },
});
