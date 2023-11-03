import React, { useState } from 'react';
import {
  View, Text, Modal, TouchableOpacity, FlatList, StyleSheet,
} from 'react-native';
import {
  arrayOf, string, shape, func,
} from 'prop-types';

export default function DropdownSelect(props) {
  const { contentItems, setChange, previous } = props;
  const [selectedValue, setSelectedValue] = useState(previous);
  const [modalVisible, setModalVisible] = useState(false);

  const onChange = (value) => {
    setSelectedValue(value);
    setChange(value);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.dropdownButton}>
        <Text>{selectedValue ? contentItems.find((item) => item.value === selectedValue).label : '未選択'}</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <FlatList
              data={contentItems}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => onChange(item.value)} style={styles.item}>
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

DropdownSelect.propTypes = {
  contentItems: arrayOf(shape({
    label: string,
    value: string,
  })).isRequired,
  setChange: func.isRequired,
  previous: string,
};

DropdownSelect.defaultProps = {
  previous: null,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dropdownButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明のグレー
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%', // この値はお好みに合わせて調整してください
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
});
