import React from "react";
import { View } from "react-native";

function Container({ children, customClasses }) {
  return (
    <View className={`flex h-screen bg-funBlue ${customClasses}`}>
      {children}
    </View>
  );
}

export default Container;
