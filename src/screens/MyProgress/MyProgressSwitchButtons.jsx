import { Pressable, View, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import ProgressPageMove from "../../enums/ProgressPageMove";

function MyProgressSwitchButtons({
  myProgressPage,
  handleChangeMyProgressPage,
}) {
  return (
    <View className="flex-[1] flex-row items-center">
      <Pressable
        className="flex-[1] items-center justify-center"
        onPress={() => handleChangeMyProgressPage(ProgressPageMove.Previous)}
      >
        <AntDesign name="left" size={30} color="#FFC857" />
      </Pressable>

      <View className="flex-[2] items-center">
        <Text className="text-white text-2xl font-medium">
          {myProgressPage.header}
        </Text>
      </View>

      <Pressable
        className="flex-[1] items-center justify-center"
        onPress={() => handleChangeMyProgressPage(ProgressPageMove.Next)}
      >
        <AntDesign name="right" size={30} color="#FFC857" />
      </Pressable>
    </View>
  );
}

export default MyProgressSwitchButtons;
