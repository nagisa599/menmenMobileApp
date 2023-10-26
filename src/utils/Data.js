import { getFirestore, doc, getDoc } from 'firebase/firestore';

export const ChangeIDtoName = async (id) => {
  const db = getFirestore();

  const ramenPath = `ramens/${id}/`;
  const ref = doc(db, ramenPath);

  try {
    const ramenDoc = await getDoc(ref);
    if (ramenDoc.exists()) {
      const ramenData = ramenDoc.data();
      return ramenData.name;
    }
  } catch (error) {
    console.log(error);
  }
  return null;
};

export function convertFirestoreTimestampToDate(timestamp) {
  const milliseconds = (timestamp.seconds * 1000) + (timestamp.nanoseconds / 1000000);
  return new Date(milliseconds);
}

export function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
