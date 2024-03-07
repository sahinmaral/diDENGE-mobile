import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

function MenuItem({ header, subHeader, onPress }) {
  return (
    <TouchableOpacity
      className="flex flex-row justify-between border-b border-white py-4"
      onPress={onPress}
    >
      <Text className="text-white text-lg">{header}</Text>
      <View className="flex flex-row gap-4 items-center">
        {subHeader ? (
          <Text className="text-white text-lg">{subHeader}</Text>
        ) : null}
        <AntDesign name="right" size={20} color="#FFC857" />
      </View>
    </TouchableOpacity>
  );
}

export default MenuItem;
