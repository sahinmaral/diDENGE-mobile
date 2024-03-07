import { useCallback } from "react";
import Container from "../../components/Container/Container";
import { BackHandler, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

function ResultOfAddictiveLevel({ route, navigation }) {
  const { addictiveLevelPoint } = route.params;

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        function () {
          console.log("Back pressed");
          return true;
        }
      );

      return () => {
        backHandler.remove();
        console.log("Component unmounted");
      };
    }, [])
  );

  return (
    <Container customClasses={"justify-center items-center"}>
      <Text className="text-white text-[35px] font-semibold">Sonuç</Text>
      <Text className="text-white text-[35px] font-semibold">
        {addictiveLevelPoint}
      </Text>
    </Container>
  );
}

export default ResultOfAddictiveLevel;
