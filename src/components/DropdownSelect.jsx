import React, { useState } from 'react';
import {
  arrayOf, string, shape, func,
} from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import RNPickerSelect from 'react-native-picker-select';

export default function DropdownSelect(props) {
  const { contentItems, setChange } = props;
  const [selectedValue, setSelectedValue] = useState(null);

  const onChange = (value) => {
    setSelectedValue(value);
    setChange(value);
  };

  return (
    <RNPickerSelect
      onValueChange={onChange}
      items={contentItems}
      placeholder={{
        label: '未登録',
        value: 0,
        color: 'black',
      }}
      style={{
        inputIOS: {
          fontSize: 16,
          paddingVertical: 12,
          paddingHorizontal: 10,
          borderRadius: 4,
          borderColor: '#DDDDDD',
          color: 'black',
          paddingRight: 30,
          backgroundColor: 'white',
        },
        inputAndroid: {
          fontSize: 16,
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderWidth: 0.5,
          borderColor: 'gray',
          borderRadius: 8,
          color: 'black',
          paddingRight: 30,
        },
      }}
    />
  );
}

DropdownSelect.propTypes = {
  contentItems: arrayOf(shape({
    label: string,
    value: string,
  })).isRequired,
  setChange: func.isRequired,
};
