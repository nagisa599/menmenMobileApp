import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { doc, getDoc } from 'firebase/firestore';
import db from '../../firebaseConfig';

const getImagePath = async (col, id) => {
  try {
    const imageDocRef = doc(db, col, id);
    const imageDocSnap = await getDoc(imageDocRef);

    if (imageDocSnap.exists()) {
      const imageData = imageDocSnap.data();
      return imageData.imageURL; // imageUrl フィールドの値を返す
    }
    console.log('imageUrlが見つかりません');
    return null;
  } catch (error) {
    console.error('imagePathの取得に失敗しました', error);
    return null;
  }
};
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

const fetchImage = async (col, id) => {
  const imagePath = await getImagePath(col, id);
  return imagePath ? getDownloadableUrl(imagePath) : null;
};

export default fetchImage;
