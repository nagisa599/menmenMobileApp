import React from 'react';
import {
  View, StyleSheet, Text,
} from 'react-native';
import {
  string, number, arrayOf, shape,
} from 'prop-types';

export default function Menu(props) {
  const { menus } = props;
  return (
    <View>
      {menus.map((menu) => (
        <View key={menu.id} style={styles.menuBox}>
          <View style={styles.menuPicture}>
            <Text>写真</Text>
          </View>
          <Text>{menu.name}</Text>
          <Text>{menu.price}</Text>
          <Text>{menu.quantity}</Text>
          <Text>{menu.favorite}</Text>
        </View>
      ))}
    </View>
  );
}

Menu.propTypes = {
  menus: arrayOf(shape({
    id: string,
    name: string,
    price: number,
    quantity: number,
    favorite: number,
  })).isRequired,
};
const styles = StyleSheet.create({
  menuBox: {
    // marginTop: 20,
    paddingVertical: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '65%',
  },
  menuPicture: {
    backgroundColor: 'blue',
    height: 160,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});
