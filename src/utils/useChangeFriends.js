import { useContext } from 'react';

import {
  doc, arrayRemove, updateDoc, arrayUnion,
} from 'firebase/firestore';
import { Alert } from 'react-native';
import db from '../../firebaseConfig';
import userInfoContext from './UserInfoContext';

const useChangeFriendList = () => {
  const { userInfo, setUserInfo } = useContext(userInfoContext);
  const { uid } = userInfo;
  const changeFriendList = async (option, friendUid, friendName) => {
    const userFriendsRef = doc(db, 'users', uid);
    const friendFriendsRef = doc(db, 'users', friendUid);

    try {
      if (option === 'add') {
        // userFriendList.push(friendUid);
        // friendFriendList.push(uid);
        const newFriends = [...userInfo.friends, friendUid];
        setUserInfo({ ...userInfo, friends: newFriends });
        await updateDoc(userFriendsRef, {
          friends: arrayUnion(friendUid),
        });
        await updateDoc(friendFriendsRef, {
          friends: arrayUnion(uid),
        });
      } else if (option === 'remove') {
        // userFriendList.splice(userFriendList.indexOf(friendUid), 1);
        // friendFriendList.splice(friendFriendList.indexOf(uid), 1);
        Alert.alert(
          `${friendName}をフレンドから削除します。`,
          '本当によろしいですか？',
          [
            {
              text: 'いいえ',
              onPress: () => console.log('いいえが押された'),
            },
            {
              text: 'はい',
              onPress: async () => {
                const newFriends = userInfo.friends.filter((item) => item !== friendUid);
                setUserInfo({ ...userInfo, friends: newFriends });
                await updateDoc(userFriendsRef, {
                  friends: arrayRemove(friendUid),
                });
                await updateDoc(friendFriendsRef, {
                  friends: arrayRemove(uid),
                });
                console.log('削除は行われた');
              },
            },
          ],
        );
      }
    } catch (error) {
      console.log('Firestoreの更新に失敗しました:', error);
    }
  };
  return changeFriendList;
};

export default useChangeFriendList;
