import React from 'react';
import { Button, Image, View } from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as ImagePicker from 'expo-image-picker';
import { func, string } from 'prop-types';
import errorMessage from '../utils/ErrorFormat';

export default function ProfileImageUpload(props) {
  const { image, setImage } = props;

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      errorMessage('画像の選択に失敗しました', error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {image
        && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginBottom: 15 }} />}
      <Button title="画像を選択してください" onPress={pickImage} />
    </View>
  );
}

ProfileImageUpload.propTypes = {
  image: string.isRequired,
  setImage: func.isRequired,
};
