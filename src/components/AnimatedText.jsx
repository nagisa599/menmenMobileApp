import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

function AnimatedText({ text, duration }) {
  const [visibleText, setVisibleText] = useState('');
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setVisibleText((prevText) => prevText + text[index]);
      index++;
      if (index === text.length) {
        clearInterval(interval);
      }
    }, duration);
    return () => clearInterval(interval);
  }, [text, duration]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{visibleText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AnimatedText;
