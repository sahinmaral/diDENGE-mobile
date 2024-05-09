import React from "react";
import { Text, View } from "react-native";

function Error({ errorMessage }) {
  return (
    <View className="flex-[9]">
      <Text
        style={{
          fontSize: 15,
          fontWeight: "300",
          textAlign: "center",
          color: "white",
        }}
      >
        {errorMessage}
      </Text>
    </View>
  );
}

export default Error;
