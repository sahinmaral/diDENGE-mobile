import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

function ModalContainer({ children, handleCloseModal }) {
  return (
    <View className="gap-y-4 justify-end px-4">
      <View className="items-end">
        <TouchableOpacity onPress={handleCloseModal}>
        <FontAwesomeIcon icon={faXmark} size={40} />
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
}

export default ModalContainer;
