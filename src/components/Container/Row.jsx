import React from "react";
import { View } from "react-native";

function Row({ flex, customClasses, children }) {
  return (
    <View style={{ flex: flex }} className={customClasses}>
      {children}
    </View>
  );
}

export default Row;
