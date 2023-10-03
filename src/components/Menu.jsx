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
          <View>
            <Image
              source={menu.image}
              style={styles.menuPicture}
            />
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
  },
  menuBox: {
    // marginTop: 20,
    paddingVertical: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '65%',
  },
  menuPicture: {
    height: 200,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
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
