import React from 'react';
import {
  View, StyleSheet, Text, Image, FlatList,
} from 'react-native';
import {
  string, number, arrayOf, shape, bool,
} from 'prop-types';

export default function Menu(props) {
  const { menus } = props;

  function renderStars(favoriteCount) {
    return Array(favoriteCount).fill('⭐️').join('');
  }

  const displayMenus = [...menus];
  if (menus.length % 2 !== 0) {
    displayMenus.push({ id: 'dummy', isDummy: true });
  }

  const renderItem = ({ item }) => {
    if (item.isDummy) {
      return (
        <View style={{
          width: '40%', margin: 10, padding: 10, marginLeft: 25,
        }}
        />
      );
    }
    return (
      <View style={[styles.menuBox, item.today ? { backgroundColor: 'lightcoral' } : {}]}>
        <Image
          source={typeof item.imageURL === 'number' ? item.imageURL : { uri: `file://${item.imageURL}` }}
          style={styles.menuPicture}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{`¥${item.price}`}</Text>
          <Text style={styles.item}>{item.student ? '学割対象' : '学割対象外'}</Text>
          <Text style={styles.item}>{`人気度: ${renderStars(item.favorite)}`}</Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={displayMenus}
      renderItem={renderItem}
      keyExtractor={(menu) => menu.id}
      numColumns={2} // 2列で表示
      contentContainerStyle={styles.container}
    />
  );
}

Menu.propTypes = {
  menus: arrayOf(shape({
    id: string,
    name: string,
    image: number,
    price: number,
    student: bool,
    favorite: number,
  })).isRequired,
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
    color: 'black',
  },
  item: {
    fontSize: 12,
    color: 'black',
  },
});
