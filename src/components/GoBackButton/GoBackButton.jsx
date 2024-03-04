import { Pressable, View, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";

function GoBackButton({ navigation, header }) {
  return (
    <View className="flex-[2] flex-row items-center gap-4">
      <Pressable
        className="w-[50px] h-[50px] rounded-full bg-saffronMango flex items-center justify-center"
        onPress={() => navigation.navigate("Homepage")}
      >
        <AntDesign name="left" size={20} color="white" />
      </Pressable>
      <Text className="text-white font-medium text-xl">{header}</Text>
    </View>
  );
}

export default GoBackButton;
