import { View, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";

function MenuItem({ header }) {
  return (
    <View className="flex flex-row justify-between border-b border-white py-4">
      <Text className="text-white text-lg">{header}</Text>
      <View className="flex flex-row gap-4 items-center">
        <AntDesign name="right" size={20} color="#FFC857" />
      </View>
    </View>
  );
}

export default MenuItem;
