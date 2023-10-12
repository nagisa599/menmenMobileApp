import React from 'react';
import {
  View, StyleSheet, Text, Image,
} from 'react-native';
import {
  string, number, arrayOf, shape, any, bool,
} from 'prop-types';

export default function Menu(props) {
  const { menus } = props;
  function renderStars(favoriteCount) {
    return Array(favoriteCount).fill('⭐️').join('');
  }

  return (
    <View style={styles.container}>
      {menus.map((menu) => (
        <View key={menu.id} style={styles.menuBox}>
          <Image
            source={menu.image}
            style={styles.menuPicture}
          />
          <View style={styles.info}>
            <Text style={styles.name}>{menu.name}</Text>
            <Text style={styles.item}>{`¥${menu.price}`}</Text>
            <Text style={styles.item}>{menu.student ? '学割対象' : '学割対象外'}</Text>
            <Text style={styles.item}>{`人気度: ${renderStars(menu.favorite)}`}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

Menu.propTypes = {
  menus: arrayOf(shape({
    id: string,
    name: string,
    // eslint-disable-next-line react/forbid-prop-types
    image: any,
    price: number,
    student: bool,
    favorite: number,
  })).isRequired,
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
