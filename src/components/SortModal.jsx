import React from 'react';
import {
  Modal, View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

function SortModal({ modalVisible, setModalVisible, handleSort }) {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalView}>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => handleSort('名前')}
        >
          <Text style={styles.buttonText}>名前</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => handleSort('登録日')}
        >
          <Text style={styles.buttonText}>登録日</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => handleSort('最終来店日')}
        >
          <Text style={styles.buttonText}>最終来店</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.buttonText}>閉じる</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

SortModal.propTypes = {
  modalVisible: PropTypes.bool.isRequired, // modalVisible は boolean 型で、必須であることを示す
  setModalVisible: PropTypes.func.isRequired, // setModalVisible は関数型で、必須であることを示す
  handleSort: PropTypes.func.isRequired, // handleSort も関数型で、必須であることを示す
};

const styles = StyleSheet.create({
  modalView: {
    flex: 0.5,
    top: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明の背景色
    margin: 10,
    borderRadius: 10,
  },
  buttonStyle: {
    width: 150,
    padding: 10,
    margin: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SortModal;
