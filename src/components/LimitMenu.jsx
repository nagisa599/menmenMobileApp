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
    }),
  ).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBox: {
    marginTop: 20,
    paddingVertical: 20,
    width: '80%',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuPicture: {
    height: 150,
    width: 150,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginLeft: 20,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  item: {
    fontSize: 14,
    color: '#888',
  },
});
