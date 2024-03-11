import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Pressable, View, Text } from "react-native";

function GoBackButton({ navigation, header }) {
  return (
    <View className="flex-[2] flex-row items-center gap-4">
      <Pressable
        className="w-[50px] h-[50px] rounded-full bg-saffronMango flex items-center justify-center"
        onPress={() => navigation.navigate("Homepage")}
      >
        <FontAwesomeIcon icon={faAngleLeft} size={20} color="white" />
      </Pressable>
      <Text className="text-white font-medium text-xl">{header}</Text>
    </View>
  );
}

export default GoBackButton;
