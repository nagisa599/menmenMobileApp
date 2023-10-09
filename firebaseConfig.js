import { getFirestore } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
// eslint-disable-next-line import/no-extraneous-dependencies
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { firebaseConfig } from './env';

let app;
let auth;

if (!getApps().length) {
  // Firebaseアプリを初期化
  app = initializeApp(firebaseConfig);
  // 認証を初期化
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  app = getApps()[0]; // 既存のアプリケーションインスタンスを取得
  auth = getAuth(app); // 既存の認証インスタンスを取得
}
const db = getFirestore(app);
export default db;
