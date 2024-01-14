import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import userInfoContext from '../utils/UserInfoContext';
import { fetchImage, fetchImage2, getFirebaseData } from '../utils/fetchImage';
import useChangeFriendList from '../utils/useChangeFriends';
import useCalcDaysDiff from '../utils/useCalcDaysDiff';
import RamensItem from '../components/RamensItem';

export default function FriendAddScreen(props) {
  const { route, navigation } = props;
  const { friendName, friendUid } = route.params;
  const { userInfo } = useContext(userInfoContext);
  const userFriendList = userInfo.friends;
  const [friendImageUrl, setFriendImageUrl] = useState('');
  const [friendInfo, setFriendInfo] = useState({});
  const [ramenImageUrl, setRamenImageUrl] = useState('');
  const [toppingImageUrl, setToppingImageUrl] = useState('');
  const [friendRamenId, setFriendRamenId] = useState('');
  const [friendToppingId, setFriendToppingId] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const dispWeek = useCalcDaysDiff(updatedAt);
  const [errorMessage, setErrorMessage] = useState('');
  const changeFriendList = useChangeFriendList();

  useEffect(() => {
    const fetchData = async () => {
      const friendData = await getFirebaseData('users', friendUid);
      if (friendData) {
        const {
          name, title, imageUrl, ramen, topping, createdAt, updatedAt: friendUpdatedAt,
        } = friendData;
        console.log(imageUrl);
        setFriendInfo({ name, title, createdAt });
        setFriendRamenId(ramen);
        setFriendToppingId(topping);
        setUpdatedAt(friendUpdatedAt);
      }
    };
    fetchData();
  }, [friendUid]);
  useEffect(() => {
    fetchImage2('users', friendUid)
      .then((imageUrl) => {
        setFriendImageUrl(imageUrl);
      })
      .catch((error) => {
        console.log('エラー', error);
      });
    if (friendRamenId) {
      fetchImage('ramens', friendRamenId)
        .then((imageUrl) => {
          setRamenImageUrl(imageUrl);
        })
        .catch((error) => {
          console.log('エラー', error);
        });
    }
    if (friendToppingId) {
      fetchImage('ramens', friendToppingId)
        .then((imageUrl) => {
          setToppingImageUrl(imageUrl);
        })
        .catch((error) => {
          console.log('エラー', error);
        });
    }
  }, [friendUid, friendRamenId, friendToppingId]);

  // すでに友達かどうかを確認する、フレンドでなければ追加する
  const isFriend = (name, uid) => {
    if (userFriendList.includes(uid)) {
      console.log('This user is already a friend');
      setErrorMessage('このユーザーはすでにフレンドです');
    } else {
      console.log(friendName, 'をフレンドに追加する');
      changeFriendList('add', uid, name);
      navigation.navigate('FriendListScreen');
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <View style={styles.imageContainer}>
          <Image
            source={friendImageUrl ? { uri: friendImageUrl } : null}
            style={styles.image}
          />
        </View>
        <Text style={styles.profileinfo}>
          名前：
          { friendInfo.name }
        </Text>
        <Text style={styles.profileinfo}>
          来店回数：
          { friendInfo.title }
        </Text>
        <Text style={styles.profileinfo}>
          最終来店日：
          {dispWeek}
        </Text>
        <Text style={styles.profileinfo}>
          登録日：
          { userInfo.createdAt.toDate().toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }) }
        </Text>
        <View style={styles.ramenAndtopping}>
          {friendRamenId && (
          <RamensItem
            ramensId={friendRamenId}
            ramensImageUrl={ramenImageUrl}
            imageStyle={{
              width: 150,
              height: 150,
              borderRadius: 10,
              borderWidth: 1,
            }}
            textStyle={{
              fontSize: 20,
              color: 'black',
            }}
          />
          )}
          {friendToppingId && (
          <RamensItem
            ramensId={friendToppingId}
            ramensImageUrl={toppingImageUrl}
            imageStyle={{
              width: 150,
              height: 150,
              borderRadius: 10,
              borderWidth: 1,
            }}
            textStyle={{
              fontSize: 20,
              color: 'black',
            }}
          />
          )}
        </View>
      </View>
      <View style={styles.buttoncontainer}>
        <TouchableOpacity
          style={styles.backbuttonContainer}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={styles.backbuttonText}>↩︎ 戻る</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.searchbuttonContainer}
          onPress={() => {
            isFriend(friendName, friendUid);
          }}
        >
          <Text style={styles.searchbuttonText}>友達登録する</Text>
        </TouchableOpacity>
        <View style={styles.errorView}>
          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        </View>
      </View>
    </View>
  );
}

FriendAddScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      friendName: PropTypes.string,
      friendUid: PropTypes.string,
    }),
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
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
  buttoncontainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  backbuttonContainer: {
    backgroundColor: 'black',
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
  },
  backbuttonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  searchbuttonContainer: {
    backgroundColor: 'orange',
    borderRadius: 10,
    alignSelf: 'center', // 自分自身を並べる。左側に
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
  },
  searchbuttonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  errorView: {
    position: 'absolute',
    top: -50,
    left: '15%',

  },
  errorText: {
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold',
  },
  ramenAndtopping: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ramenimage: {
    width: 150,
    height: 150,
    margin: 2,
    borderRadius: 10,
    borderWidth: 2,
  },
});
