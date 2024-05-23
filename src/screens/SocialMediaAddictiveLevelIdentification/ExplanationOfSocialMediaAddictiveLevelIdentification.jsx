import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useCallback } from "react";
import { BackHandler, Pressable, Text, View } from "react-native";
import Container from "../../components/Container/Container";
import ModalContentTypes from "../../enums/ModalContentTypes";
import SocialMediaAddictionLevelIdentificationLogo from "../../../assets/social-media-addiction-level-identification-logo.svg";
import { useDispatch } from "react-redux";
import { setModalContent } from "../../redux/slices/modalSlice";
import { useFocusEffect } from "@react-navigation/native";

function ExplanationOfSocialMediaAddictiveLevelIdentification({
  navigation,
  route,
}) {
  const dispatch = useDispatch();

  const { userAddictionLevel } = route.params;

  const handleHardwareBackPress = () => {
    dispatch(
      setModalContent(
        ModalContentTypes.VerifyExitSocialMediaAddictionLevelIdentification
      )
    );

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

  const renderExplanationContent = useCallback(() => {
    if (userAddictionLevel !== null) {
      return (
        <View>
          <Text className="text-2xl font-bold mb-2">
            Sosyal Medya Bağımlılık Seviye Tespiti Tekrarı
          </Text>
          <Text className="text-lg text-white">
            Seni burada yeniden görmek güzel. Bu anketi zaten çözdüğünü
            biliyoruz.
            <Text className="text-lg text-white font-bold">21 gün</Text> doldu
            ve bakalım emeklerinin karşılığını alabilmiş misin ?{" "}
            <Text className="text-lg text-white font-bold">
              Sosyal medya bağımlılık seviyeni
            </Text>{" "}
            tekrardan tespit edebilmek için bu testi çözmen gerekecek.
          </Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text className="text-2xl font-bold mb-2">
            Sosyal Medya Bağımlılık Seviye Tespiti
          </Text>
          <Text className="text-lg text-white">
            Uygulamada yer alan özelleştirilmiş yapay zekanın size en iyi
            şekilde hizmet edebilmesi için{" "}
            <Text className="text-lg text-white font-bold">
              Sağlık Bakanlığı
            </Text>{" "}
            tarafından sağlanmış olan{" "}
            <Text className="text-lg text-white font-bold">41</Text> soruluk
            anketi doldurmanız gerekir ve bu anketi her 21 günde bir doldurmanız
            gerekiyor.
          </Text>
        </View>
      );
    }
  }, [userAddictionLevel]);

  return (
    <Container customClasses="px-4 py-12">
      <View className="flex-[3]">{renderExplanationContent()}</View>
      <View className="flex-[6] items-center justify-center ">
        <SocialMediaAddictionLevelIdentificationLogo width={300} height={300} />
      </View>
      <View className="flex-[1] justify-end">
        <Pressable
          onPress={() => {
            navigation.navigate("SocialMediaAddictiveLevelIdentification");
          }}
          className="flex flex-row justify-between items-center bg-darkJungleGreen rounded-md h-[50px] px-10"
        >
          <Text className="text-white text-[22px] font-light">
            Haydi başlayalım
          </Text>
          <FontAwesomeIcon icon={faAnglesRight} color="white" size={20} />
        </Pressable>
      </View>
    </Container>
  );
}

export default ExplanationOfSocialMediaAddictiveLevelIdentification;
