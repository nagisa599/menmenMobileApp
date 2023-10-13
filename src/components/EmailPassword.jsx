import React, { useState } from 'react';
import {
  View, TextInput, Button, StyleSheet,
} from 'react-native';
import { PropTypes } from 'prop-types';

function EmailPasswordForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = () => {
    // メールアドレスとパスワードを使ってログインの処理を行う
    onSubmit(email, password);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="メールアドレス"
          onChangeText={setEmail}
          value={email}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="パスワード"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
      </View>
      <Button title="ログイン" onPress={handleLogin} />
    </View>
  );
}

EmailPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  inputContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
  },
});

export default EmailPasswordForm;
