import React from "react";
import { View } from "react-native";

function Container({ children, customClasses }) {
  return (
    <View className={`flex-1 h-screen bg-funBlue ${customClasses}`}>
      {children}
    </View>
  );
}

export default Container;
