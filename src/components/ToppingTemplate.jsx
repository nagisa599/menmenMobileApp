import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { arrayOf, shape, string } from 'prop-types';

export default function ToppingTemplate(props) {
  const { toppingName, options } = props;
  return (
    <View style={styles.container}>
      <View style={styles.border}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{toppingName}</Text>
        </View>
        <View style={styles.optionContainer}>
          {options.map((option) => (
            <View>
              <View style={styles.circleOption}>
                <Text style={styles.circleText} numberOfLines={2}>{option.name}</Text>
              </View>
              {option.explain && (
                <View style={styles.explainContainer}>
                  <Text style={styles.explainText}>{option.explain}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

ToppingTemplate.propTypes = {
  toppingName: string.isRequired,
  options: arrayOf(
    shape({
      name: string.isRequired,
      explain: string,
    }),
  ).isRequired,
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  border: {
    borderWidth: 3,
    borderRadius: 15,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 26,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  circleOption: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  circleText: {
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  explainContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  explainText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});
