import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Container from "../../components/Container/Container";
import SocialMediaAddictionLevelIdentificationLogo from "../../../assets/social-media-addiction-level-identification-logo.svg";

function ExplanationOfSocialMediaAddictiveLevelIdentification({ navigation }) {
  return (
    <Container customClasses="px-4 py-12">
      <View className="flex-[3]">
        <Text className="text-2xl font-bold mb-2">
          Sosyal Medya Bağımlılık Seviye Tespiti
        </Text>
        <Text className="text-lg text-white">
          Uygulamada yer alan özelleştirilmiş yapay zekanın size en iyi şekilde
          hizmet edebilmesi için{" "}
          <Text className="text-lg text-white font-bold">Sağlık Bakanlığı</Text>{" "}
          tarafından sağlanmış olan{" "}
          <Text className="text-lg text-white font-bold">41</Text> soruluk
          anketi doldurmanız gerekir.
        </Text>
      </View>
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
