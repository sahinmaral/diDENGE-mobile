import React from "react";
import { View, TouchableOpacity } from "react-native";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

function Container({ children, handleCloseModal }) {
  return (
    <View className="flex-grow justify-end">
      <View className="items-end px-4 pt-4 bg-white">
        <TouchableOpacity onPress={handleCloseModal}>
          <FontAwesomeIcon icon={faXmark} size={40} />
        </TouchableOpacity>
      </View>
      <View className="bg-white px-4">{children}</View>
    </View>
  );
}

export default Container;
