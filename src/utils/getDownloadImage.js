import * as FileSystem from 'expo-file-system';

export default function getDownloadedImageUri(relativePath) {
  return `${FileSystem.documentDirectory}${relativePath}`;
}
