import * as FileSystem from 'expo-file-system';

export default async function createImagesDirectory(directory) {
  const imagesDir = `${FileSystem.documentDirectory}${directory}`;

  const dirInfo = await FileSystem.getInfoAsync(imagesDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imagesDir, { intermediates: true });
  }
}
