import React, { useEffect, useState } from "react";
import Container from "../../components/Container/Container";
import { AppState, Pressable, Text, View } from "react-native";
import AppPermissionLogo from "../../../assets/app-permission.svg";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "react-native-toast-notifications";
import { useSelector } from "react-redux";
import { USAGE_STATS_PERMISSION_NOT_ACCEPTED } from "../../constants/messages";
import UsageStatsService from "../../services/usageStatsService";
import ToastService from "../../services/toastService";
import ToastOptions from "../../classes/ToastOptions";
import ToastTypes from "../../enums/ToastTypes";
import { selectUser } from "../../redux/slices/authSlice";

function CheckPermissionForNewUser({ navigation }) {
  const [isUsageStatPermissionGranted, setIsUsageStatPermissionGranted] =
    useState(false);

  const user = useSelector(selectUser);

  const toast = useToast();

  const usageStatsService = new UsageStatsService();
  const toastService = new ToastService(toast);

  const checkPermission = () => {
    usageStatsService.checkForPermission().then((result) => {
      setIsUsageStatPermissionGranted(result);
      if (!result) {
        toastService.showToast(
          USAGE_STATS_PERMISSION_NOT_ACCEPTED,
          new ToastOptions(ToastTypes.Success)
        );
      }
    });
  };

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === "active") {
      checkPermission();
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (isUsageStatPermissionGranted) {
      if (user.isNewUser) {
        navigation.navigate(
          "ExplanationOfSocialMediaAddictiveLevelIdentification",
          {
            userAddictionLevelData: null,
          }
        );
      } else {
        navigation.navigate("App");
      }
    }
  }, [isUsageStatPermissionGranted, navigation, user]);

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
            usageStatsService.showUsageAccessSettings();
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
