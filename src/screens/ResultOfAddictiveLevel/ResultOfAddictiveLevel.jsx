import { useCallback } from "react";
import Container from "../../components/Container/Container";
import { BackHandler, Pressable, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ResultOfAddictiveLevelLogo from "../../../assets/result-of-addictive-level.svg";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { setModalContent } from "../../redux/slices/modalSlice";
import ModalContentTypes from "../../enums/ModalContentTypes";

function ResultOfAddictiveLevel({ route, navigation }) {
  const { dailyLimit, addictionLevel, userGrade, minimumGrade, maximumGrade } =
    route.params;

  const dispatch = useDispatch();

  const handleHardwareBackPress = () => {
    dispatch(setModalContent(ModalContentTypes.VerifyCloseApp));

    return true;
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

  return (
    <Container customClasses={"px-4 py-12"}>
      <View className="flex-[6]">
        <Text className="text-2xl font-bold mb-2">Sonuç</Text>

        <View className="flex-row flex-wrap">
          <Text className="text-lg text-white">
            Sağlık Bakanlığı tarafından sağlanan 41 soruluk sosyal medya
            bağımlılık ölçeği sonucu olarak{" "}
            <Text className="font-bold">{userGrade} </Text>
            puanla{" "}
            <Text className="font-bold">
              {minimumGrade} - {maximumGrade} puan aralığında{" "}
            </Text>
            yer alan <Text className="font-bold">"{addictionLevel}" </Text>
            seviye olduğunuz tespit edilmiştir. Günlük sosyal meda kullanım
            limitiniz <Text className="font-bold">{dailyLimit}</Text> dakikadır.
            Bağımlılığınızı yenebilmek adına bu süreyi aşmamanız gerekir, her{" "}
            <Text className="font-bold">21 günde bir </Text>sizin bağımlılık
            seviyenizi ölçüyor olacağız. Kendinizi hazırlamak adına{" "}
            <Text className="font-bold">bugünü pas geçiyoruz. </Text>Ama yarın
            sizleri hazır olarak görmek isteriz. O zaman hadi başlayalım.
          </Text>
        </View>
      </View>
      <View className="flex-[3] items-center justify-center">
        <ResultOfAddictiveLevelLogo width={200} height={200} />
      </View>
      <View className="flex-[1] justify-end">
        <Pressable
          onPress={() => {
            navigation.navigate("App");
          }}
          className="flex flex-row justify-between items-center bg-darkJungleGreen rounded-md h-[50px] px-10"
        >
          <Text className="text-white text-[22px] font-light">Başlayalım</Text>
          <FontAwesomeIcon icon={faAnglesRight} color="white" size={20} />
        </Pressable>
      </View>
    </Container>
  );
}

export default ResultOfAddictiveLevel;
