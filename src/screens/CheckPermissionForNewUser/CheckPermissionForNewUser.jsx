import React, { useEffect, useState } from "react";
import Container from "../../components/Container/Container";
import { AppState, NativeModules, Pressable, Text, View } from "react-native";
import AppPermissionLogo from "../../../assets/app-permission.svg";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "react-native-toast-notifications";
import { useSelector } from "react-redux";

const { UsageStats } = NativeModules;

function CheckPermissionForNewUser({ navigation }) {
  const [isUsageStatPermissionGranted, setIsUsageStatPermissionGranted] =
    useState(false);

  const { user } = useSelector((state) => state.auth);

  const toast = useToast();

  const checkPermission = () => {
    UsageStats.checkForPermission().then((result) => {
      setIsUsageStatPermissionGranted(result);
      if (!result) {
        toast.show(
          "Kullanım verilerine erişim iznini onaylamadınız. Lütfen tekrar deneyiniz",
          { type: "danger", placement: "top" }
        );
      }
    });
  };

  AppState.addEventListener("change", (nextAppState) => {
    if (nextAppState === "active") {
      checkPermission();
    }
  });

  useEffect(() => {
    if (isUsageStatPermissionGranted) {
      if (user.isNewUser) {
        navigation.navigate(
          "ExplanationOfSocialMediaAddictiveLevelIdentification"
        );
      } else {
        navigation.navigate("App");
      }
    }
  }, [isUsageStatPermissionGranted]);

  return (
    <Container customClasses="px-4 py-12">
      <View className="flex-[3]">
        <Text className="text-2xl font-bold mb-2">
          Kullanım Verilerine Erişim
        </Text>
        <Text className="text-lg text-white">
          diDENGE uygulamasının amaçlarından biri olan sosyal medya
          uygulamalarının istatistiklerine göre plan oluşturmak için kullanım
          verilerinin erişimi
        </Text>
        <Text className="text-lg text-white font-bold">gereklidir.</Text>
      </View>
      <View className="flex-[6] items-center justify-center ">
        <AppPermissionLogo width={300} height={300} />
      </View>
      <View className="flex-[1] justify-end">
        <Pressable
          onPress={() => {
            UsageStats.showUsageAccessSettings("com.didenge");
          }}
          className="flex flex-row justify-between items-center bg-darkJungleGreen rounded-md h-[50px] px-10"
        >
          <Text className="text-white text-[22px] font-light">İzin ver</Text>
          <FontAwesomeIcon icon={faAnglesRight} color="white" size={20} />
        </Pressable>
      </View>
    </Container>
  );
}

export default CheckPermissionForNewUser;
