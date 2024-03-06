import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import styles from './DropdownComponent.styles';

const data = [
  { label: 'Teşekkür', value: '1' },
  { label: 'Şikayet', value: '2' },
  { label: 'Diğer', value: '3' },
];

const DropdownComponent = () => {
  const [value, setValue] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    
  };

  return (
    <Dropdown
      className="text-[16px] py-2 bg-gray-100 text-center"
      placeholderTextColor="gray"
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={data}
      labelField="label"
      valueField="value"
      placeholder={isFocused ? '' : '...'}
      value={value}
      onChange={item => setValue(item.value)}
      renderLeftIcon={null}
      renderRightIcon={() => (
        <AntDesign
          style={styles.icon}
          color={isFocused ? 'blue' : 'black'}
          name={isFocused ? '' : ''} //Burası eksik
          size={15}
        />
      )}
      onFocus={handleFocus} 
      onBlur={handleBlur}  
    />
  );
};

export default DropdownComponent;
