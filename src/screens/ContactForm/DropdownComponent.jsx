import { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import styles from './DropdownComponent.styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

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
      containerStyle={styles.containerStyle}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      data={data}
      labelField="label"
      valueField="value"
      placeholder={isFocused ? '...' : 'Seçiniz'}
      value={value}
      onChange={item => setValue(item.value)}
      renderLeftIcon={null}
      renderRightIcon={() => (
        <FontAwesomeIcon
          style={styles.icon}
          icon={isFocused ? faChevronUp : faChevronDown}
          size={15}
        />
      )}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
};

export default DropdownComponent;
