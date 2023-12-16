import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

export default function FriendDetailScreen(props) {
  const { route, navigation } = props;
  const {
    name, updatedAt, createdAt, url, ramen, topping, title,
  } = route.params;
  return (
    <View style={styles.container}>
      {/* <View style={styles.tabContainer}>
        <Tab label="フレンド" onPress={() => { }} active />
        <Tab
          label="回数券"
          onPress={() => {
            navigation.navigate('BookOfTicketScreen');
          }}
        />
      </View> */}
      <ScrollView style={styles.profile}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: url }}
            style={styles.image}
          />
        </View>
        <Text style={styles.profileinfo}>
          名前：
          { name }
        </Text>
        <Text style={styles.profileinfo}>
          登録日：
          { createdAt.toDate().toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }) }

        </Text>
        <Text style={styles.profileinfo}>
          最終来店日：
          { updatedAt.toDate().toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }) }

        </Text>
        <Text style={styles.profileinfo}>
          総ラーメン：
          { title }
        </Text>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: ramen }}
            style={styles.image}
          />
          <Image
            source={{ uri: topping }}
            style={styles.image}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.profileinforamen}>
            お気に入り
            {'\n'}
            ラーメン＆トッピング
          </Text>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Text style={styles.buttonText}>↩︎ 戻る</Text>
      </TouchableOpacity>
      {/* <PassButton label="回数券を渡す" /> */}
    </View>
  );
}

FriendDetailScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.string,
      birthday: PropTypes.string,
      createdAt: PropTypes.shape({
        nanoseconds: PropTypes.number.isRequired,
        seconds: PropTypes.number.isRequired,
      }).isRequired,
      updatedAt: PropTypes.shape({
        nanoseconds: PropTypes.number.isRequired,
        seconds: PropTypes.number.isRequired,
      }).isRequired,
      url: PropTypes.string,
      ramen: PropTypes.string,
      topping: PropTypes.string,
      title: PropTypes.string,
    }),
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // tabContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   paddingVertical: 30,
  //   backgroundColor: 'rgb(242, 242, 242)',
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.10,
  //   shadowRadius: 3.84,
  //   elevation: 5,
  // },
  imageContainer: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    margin: 10,
  },
  image: {
    width: 170,
    height: 170,
    borderRadius: 10,
    borderWidth: 2,
  },
  profile: {
    margin: 10,
    borderWidth: 5,
    borderColor: 'rgba(0, 0, 0, 0.1)',

  },
  profileinfo: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
    marginLeft: 20,
    marginTop: 5,
  },
  profileinforamen: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    backgroundColor: 'black',
    borderRadius: 10,
    alignSelf: 'center', // 自分自身を並べる。左側に
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    bottom: '1%',
    height: 70,
  },
  buttonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
