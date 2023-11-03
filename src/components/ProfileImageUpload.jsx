import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, Platform,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

function ProfileImageUpload() {
  const [profileImage, setProfileImage] = useState();

  const handleChoosePhoto = () => {
    const options = {
      noData: true,
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        setProfileImage(source);
      }
    });
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {profileImage && (
        <Image
          source={{ uri: profileImage.uri }}
          style={{ width: 200, height: 200, borderRadius: 100 }}
        />
      )}
      <TouchableOpacity onPress={handleChoosePhoto}>
        <Text>Select a Photo</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ProfileImageUpload;
