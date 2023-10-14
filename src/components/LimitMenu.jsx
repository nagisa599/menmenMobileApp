import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, Text, Image, FlatList,
} from 'react-native';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
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

  const renderItem = ({ item, index }) => (
    <View style={styles.menuBox} key={item.id}>
      <Image source={{ uri: imageUrls[index] }} style={styles.menuPicture} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{`¥${item.price}`}</Text>
        <Text style={styles.item}>{item.student ? '学割対象' : '学割対象外'}</Text>
        <Text style={styles.item}>{`人気度: ${renderStars(item.favorite)}`}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={menus}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2} // 2列で表示
      contentContainerStyle={styles.container}
    />
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
    paddingVertical: 0,
  },
  menuBox: {
    margin: 10,
    padding: 10,
    width: '40%',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    marginLeft: 25,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuPicture: {
    height: 100,
    width: 115,
    borderRadius: 10,
  },
  info: {
    alignItems: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
  },
  price: {
    fontSize: 12,
    color: '#888',
  },
  item: {
    fontSize: 12,
    color: '#888',
  },
});
