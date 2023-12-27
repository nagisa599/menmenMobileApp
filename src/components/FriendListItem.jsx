import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, Image, Button, Modal, TouchableOpacity, TouchableWithoutFeedback,
} from 'react-native';
import PropTypes, { string, number } from 'prop-types';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

import RamensItem from './RamensItem';
import { fetchImage, getFirebaseData } from '../utils/fetchImage';
import useCalcDaysDiff from '../utils/useCalcDaysDiff';
import useChangeFriendList from '../utils/useChangeFriends';

export default function FriendListItem({
  uid, userimagePath, createdAt, updatedAt, name, ramenId, toppingId, title,
}) {
  const [friendImageUrl, setFriendImageUrl] = useState('');
  const [ramenImageUrl, setRamenImageUrl] = useState('');
  const [toppingImageUrl, setToppingImageUrl] = useState('');
  const dispWeek = useCalcDaysDiff(updatedAt);
  const changeFriendList = useChangeFriendList();
  const [modalVisible, setModalVisible] = useState(false);
  // #############################################################
  // firebaseのusersのimageUrlがimageURLに変わるまで
  const getDownloadableUrl = async (imagePath) => {
    const storage = getStorage();
    const imageRef = ref(storage, imagePath);
    try {
      const downloadedImageUrl = await getDownloadURL(imageRef);
      return downloadedImageUrl;
    } catch (error) {
      console.error('画像のダウンロードURLの取得に失敗しました', error);
      return null;
    }
  };
  // useEffect内では非同期処理を直接実行ではなく、非同期関数を定義してその関数を呼び出す必要がある
  useEffect(() => {
    const fetchUserImageUrl = async () => {
      try {
        const downloadedImageUrl = await getDownloadableUrl(userimagePath);
        setFriendImageUrl(downloadedImageUrl);
      } catch (error) {
        console.error('画像のダウンロードURLの取得に失敗しました', error);
      }
    };
    fetchUserImageUrl();
  }, [userimagePath]);
  // ###############################################################

  useEffect(() => {
    fetchImage('ramens', ramenId)
      .then((imageUrl) => {
        setRamenImageUrl(imageUrl);
      })
      .catch((error) => {
        console.log('エラー:', error);
      });
    fetchImage('ramens', toppingId)
      .then((imageUrl) => {
        setToppingImageUrl(imageUrl);
      })
      .catch((error) => {
        console.log('エラー:', error);
      });
  }, [ramenId, toppingId]);
  return (
    <View style={styles.indivisual}>
      <Image source={friendImageUrl ? { uri: friendImageUrl } : null} style={styles.userImage} />
      <View style={styles.textinfo}>
        <Text style={styles.userName}>{ name }</Text>
        <Text style={styles.date}>
          最終来店日：
          {dispWeek}
        </Text>
        <Text>
          登録日：
          { createdAt.toDate().toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }) }
        </Text>
        <Text>
          来店回数：
          { title }
        </Text>
      </View>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.ramenAndtopping}>
        <Image source={ramenImageUrl ? { uri: ramenImageUrl } : null} style={styles.ramenImage} />
        <Image
          source={toppingImageUrl ? { uri: toppingImageUrl } : null}
          style={styles.toppingImage}
        />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.ramenModalView}>
          <RamensItem ramensId={ramenId} ramensImageUrl={ramenImageUrl} />
          <RamensItem ramensId={toppingId} ramensImageUrl={toppingImageUrl} />
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.removeFriend}>
            <Text style={styles.backFriendText}>×</Text>
          </TouchableOpacity>
        </View>

      </Modal>
      <TouchableOpacity onPress={() => changeFriendList('remove', uid, name)} style={styles.removeFriend}>
        <Text style={styles.removeFriendText}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

FriendListItem.propTypes = {
  uid: string.isRequired,
  userimagePath: string.isRequired,
  createdAt: PropTypes.shape({
    nanoseconds: PropTypes.number.isRequired,
    seconds: PropTypes.number.isRequired,
  }).isRequired,
  updatedAt: PropTypes.shape({
    nanoseconds: PropTypes.number.isRequired,
    seconds: PropTypes.number.isRequired,
  }).isRequired,
  name: string.isRequired,
  ramenId: string.isRequired,
  toppingId: string.isRequired,
  title: number.isRequired,
  // friends: PropTypes.arrayOf(PropTypes.string),
};

// FriendListItem.defaultProps = {
//   friends: [], // デフォルト値として空の配列を設定
// };

const styles = StyleSheet.create({
  indivisual: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    margin: 5,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 10,
    positoin: 'relative',
  },
  ramenModalView: {
    flex: 0.5,
    top: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // 半透明の背景色
    margin: 10,
    borderRadius: 10,
    position: 'relative',
  },
  ramenImageModal: {
    width: 150,
    height: 150,
    borderRadius: 10,
    borderWidth: 2,
  },
  toppingImageModal: {
    width: 150,
    height: 150,
    borderRadius: 10,
    borderWidth: 2,
  },
  backModal: {
    fontSize: 20,
    position: 'absolute',
    top: 50,
    right: 10,

  },
  userImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    borderWidth: 2,
  },
  ramenAndtopping: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 5,
    right: 10,
  },
  ramenImage: {
    width: 60,
    height: 60,
    margin: 1,
    borderRadius: 10,
    borderWidth: 1,
  },
  toppingImage: {
    width: 60,
    height: 60,
    margin: 1,
    borderRadius: 10,
    borderWidth: 1,
  },
  userName: {
    fontSize: 30,
  },
  textinfo: {
    marginLeft: 15,
  },
  removeFriend: {
    position: 'absolute',
    top: 0,
    right: 10,
  },
  removeFriendText: {
    fontSize: 30,
    color: 'red',
    fontWeight: 'bold',
  },
  backFriendText: {
    fontSize: 50,
    color: 'white',
    fontWeight: 'bold',
  },
});
