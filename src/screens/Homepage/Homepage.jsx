import Container from "../../components/Container/Container";
import {
  View,
  Text,
  BackHandler,
  StatusBar,
} from "react-native";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import WordOfTheDay from "./WordOfTheDay";
import { setModalContent } from "../../redux/slices/modalSlice";
import ModalContentTypes from "../../enums/ModalContentTypes";
import { useFocusEffect } from "@react-navigation/native";
import TodayTotalSpendTimeResultGraph from "./TodayTotalSpendTimeResultGraph/TodayTotalSpendTimeResultGraph";
import UserProfileShort from "./UserProfileShort/UserProfileShort";

function Homepage({ updateCurrentScreen }) {
  const dispatch = useDispatch();

  const handleHardwareBackPress = () => {
    dispatch(setModalContent(ModalContentTypes.VerifyCloseApp));

    return true;
  };

  useEffect(() => {
    updateCurrentScreen("Homepage");
  }, []);

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

  return (
    <Container customClasses="px-4 py-2">
      <StatusBar
        hidden={false}
        backgroundColor="#2660A4"
        barStyle="light-content"
      />

      <View className="flex-[2]">
        <UserProfileShort />
      </View>

      <View className="flex-[3]">
        <View>
          <Text className="text-white text-[18px] font-medium">Özet</Text>
          <Text className="text-white">
            Kullanıcının haftalık ne kadar vakit geçirdiği ve sıklıkla hangi
            uygulamada vakit geçirdiğine dair özet bilgi
          </Text>
        </View>
        <View className="items-end">
          <Text className="underline text-saffronMango">Detay göster</Text>
        </View>
      </View>

      <View className="flex-[2]">
        <WordOfTheDay />
      </View>

      <View className="flex-[1.5]">
        <View>
          <Text className="text-white text-[18px] font-medium">Odak Mod</Text>
          <View className="flex flex-row justify-between">
            <Text className="text-white">2 saat 32 dakika kaldı</Text>
            <Text className="underline text-saffronMango">
              Odak Modunu Kapat
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-[8]">
        <TodayTotalSpendTimeResultGraph />
      </View>
    </Container>
  );
}

export default Homepage;
