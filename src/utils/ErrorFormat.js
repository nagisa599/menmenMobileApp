import { Alert } from 'react-native';

export default function errorMessage(alertText, error) {
  Alert.alert(alertText);
  if (error) {
    console.log(error);
  }
}
