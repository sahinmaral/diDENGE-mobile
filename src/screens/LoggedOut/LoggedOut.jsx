import { useCallback, useEffect, useState } from "react";
import { BackHandler, Image, Text, View } from "react-native";
import Container from "../../components/Container/Container";
import logoutLogo from "../../../assets/logout.png";
import LoadingDots from "./LoadingDots";
import { clearUser } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { sleep } from "../../utils/timeUtils";
import BackgroundService from "react-native-background-actions";
import { useFocusEffect,CommonActions } from "@react-navigation/native";

function LoggedOut({ navigation, route }) {
  const dispatch = useDispatch();

  const [textContent] = useState(
    !route.params ? "Oturum sonlandırılıyor" : route.params.message
  );

  const handleHardwareBackPress = () => {
    return true;
  };

  const logout = async () => {
    await BackgroundService.stop();
    await sleep(3000);

    dispatch(clearUser());

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleHardwareBackPress
      );

      return () => {
        backHandler.remove();
      };
    }, [])
  );

  useEffect(() => {
    logout();
  }, []);

  return (
    <Container>
      <View className="flex-1 items-center justify-center gap-y-4">
        <Image
          source={logoutLogo}
          className="w-[75] h-[75]"
          contentFit="fill"
        />
        <View className="flex gap-6">
          <View className="w-screen items-center">
            <Text className="text-white text-lg">{textContent}</Text>
          </View>
          <View className="w-screen flex items-center">
            <LoadingDots />
          </View>
        </View>
      </View>
    </Container>
  );
}

export default LoggedOut;
