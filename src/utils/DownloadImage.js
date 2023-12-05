import * as FileSystem from 'expo-file-system';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import createImagesDirectory from './createImagesDirectory';

export function getDownloadedImageUri(relativePath) {
  return `${FileSystem.documentDirectory}${relativePath}`;
}
export async function downloadUserImage(imageURL) {
  const storage = getStorage();
  const auth = getAuth();

  const imageRef = ref(storage, imageURL);
  const url = await getDownloadURL(imageRef);

  await createImagesDirectory('user');
  const relativePath = `user/${auth.currentUser.uid}`;
  const downloadDest = `${FileSystem.documentDirectory}${relativePath}`;

  const downloadResult = await FileSystem.downloadAsync(url, downloadDest);

  if (downloadResult.status !== 200) {
    console.error('Error downloading the image:', downloadResult);
    return null;
  }
  return relativePath;
}
