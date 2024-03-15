import { Pressable, View, Text } from "react-native";
import ProgressPageMove from "../../enums/ProgressPageMove";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

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
        <FontAwesomeIcon icon={faAngleLeft} size={30} color="#FFC857" />
      </Pressable>

      <View className="flex-[2] items-center">
        <Text className="text-white text-xl font-medium text-center">
          {myProgressPage.header}
        </Text>
      </View>

      <Pressable
        className="flex-[1] items-center justify-center"
        onPress={() => handleChangeMyProgressPage(ProgressPageMove.Next)}
      >
        <FontAwesomeIcon icon={faAngleRight} size={30} color="#FFC857" />
      </Pressable>
    </View>
  );
}

export default MyProgressSwitchButtons;
