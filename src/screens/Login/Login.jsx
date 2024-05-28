import { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  Image,
  Animated,
} from "react-native";
import appLogo from "../../../assets/appLogo.png";
import facebookLogo from "../../../assets/facebookLogo.png";
import googleLogo from "../../../assets/googleLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Container from "../../components/Container/Container";
import { useFormik } from "formik";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useToast } from "react-native-toast-notifications";
import LoginUserSchema from "../../schemas/LoginUserSchema";
import translatedErrorMessages from "../../locale";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import useSpinAnimation from "../../hooks/useSpinAnimation";
import apiService from "../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/slices/authSlice";
import { setWordOfTheDay } from "../../redux/slices/appSlice";
import ProcedurePointInformationSaveStatusTypes from "../../enums/ProcedurePointInformationSaveStatusTypes";
import ToastService from "../../services/toastService";
import UsageStatsService from "../../services/usageStatsService";
import ToastOptions from "../../classes/ToastOptions";
import ToastTypes from "../../enums/ToastTypes";
import ProcedureService from "../../services/procedureService";
import {
  ERROR_DURING_LOGIN,
  SUCCESSFULLY_LOGGED_IN,
} from "../../constants/messages";
import { getCurrentTime, differenceInDays } from "../../utils/timeUtils";
import moment from "moment";
import { SOCIAL_MEDIA_ADDICTION_LEVEL_IDENTIFICATION_TEST_REPEAT_DAY } from "../../constants";

function Login({ navigation }) {
  const [securePassword, setSecurePassword] = useState(true);

  const user = useSelector((state) => state.auth.user);
  const spin = useSpinAnimation();
  const toast = useToast();
  const dispatch = useDispatch();

  const toastService = new ToastService(toast);
  const procedureService = new ProcedureService();
  const usageStatsService = new UsageStatsService();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginUserSchema,
    onSubmit: async (values) => await handleSubmit(values),
  });

  const togglePasswordVisibility = () => {
    setSecurePassword((prev) => !prev);
  };

  const checkFormikErrors = () => {
    if (!formik.isValid && !formik.isValidating && formik.isSubmitting) {
      const errorWithStars = Object.values(formik.errors)
        .map((error) => `* ${error}`)
        .join("\n");

      toastService.showToast(
        errorWithStars,
        new ToastOptions(ToastTypes.Warning)
      );
    }
  };

  useEffect(() => {
    (async () => {
      const hasPermissionOfUsageStats =
        await usageStatsService.checkForPermission();

      if (user !== null) {
        if (!hasPermissionOfUsageStats) {
          navigation.navigate("CheckPermissionForNewUser");
        } else {
          const timeOfLatestSocialMediaAddictionLevelTest = differenceInDays(
            getCurrentTime(),
            moment(user.addictionLevel.createdAt)
          );

          if (
            timeOfLatestSocialMediaAddictionLevelTest >=
            SOCIAL_MEDIA_ADDICTION_LEVEL_IDENTIFICATION_TEST_REPEAT_DAY
          ) {
            navigation.navigate(
              "ExplanationOfSocialMediaAddictiveLevelIdentification",
              {
                userAddictionLevelData: user.addictionLevel,
              }
            );
          } else if (user.isNewUser) {
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
      }
    })();
  }, [user]);

  useEffect(() => {
    checkFormikErrors();
  }, [formik]);

  const handleSubmit = async (values) => {
    try {
      const [loginResult, fetchRandomWordOfTheDayResult] = await Promise.all([
        apiService.auth.fetchLoginUser({
          userNameOrEmail: values.email,
          password: values.password,
        }),
        apiService.wordOfTheDays.fetchGetRandomWordOfTheDay(),
      ]);

      const { data: loggedInUserData } = loginResult;
      const { data: randomWordOfTheDay } = fetchRandomWordOfTheDayResult;

      const { data: userAddictionLevelData } =
        await apiService.addictionLevels.fetchGetAddictionLevelByUserId(
          loggedInUserData.id
        );

      const savedUser = {
        ...loggedInUserData,
        addictionLevel: userAddictionLevelData,
      };

      dispatch(setUser(savedUser));

      if (!loggedInUserData.isNewUser) {
        const procedurePointInformationsResponse =
          await apiService.procedures.fetchGetProcedurePointInformationsByUserId(
            loggedInUserData.id
          );

        const procedurePointInformationsResponseData =
          procedurePointInformationsResponse.data.items;

        await procedureService.updateNewSavedProcedurePointInformations(
          savedUser,
          procedurePointInformationsResponseData,
          ProcedurePointInformationSaveStatusTypes.Lately,
          dispatch
        );
      }

      dispatch(setWordOfTheDay(randomWordOfTheDay.content));

      toastService.showToast(
        SUCCESSFULLY_LOGGED_IN,
        new ToastOptions(ToastTypes.Success)
      );
    } catch (error) {
      console.log(JSON.stringify(error));
      if (error.response) {
        const { data } = error.response;

        toastService.showToast(
          translatedErrorMessages[data.Detail],
          new ToastOptions(ToastTypes.Danger)
        );
      } else {
        toastService.showToast(
          ERROR_DURING_LOGIN,
          new ToastOptions(ToastTypes.Danger)
        );
      }
    }
  };

  return (
    <Container>
      <View className="flex-[3] justify-center items-center">
        <Image source={appLogo} className="w-[200] h-[75]" contentFit="fill" />
      </View>
      <View className="px-4 flex-[4]">
        <View style={{ flex: 3 / 9 }} className="gap-4">
          <View className="gap-2">
            <TextInput
              className="border-b border-white text-[16px] text-white pt-2 pb-4"
              placeholderTextColor="white"
              placeholder="E-posta adresi"
              onChangeText={formik.handleChange("email")}
              onBlur={formik.handleBlur("email")}
              value={formik.values.email}
            />
            <View>
              <TextInput
                className="border-b border-white text-[16px] text-white pt-2 pb-4"
                placeholderTextColor="white"
                placeholder="Şifre"
                onChangeText={formik.handleChange("password")}
                onBlur={formik.handleBlur("password")}
                value={formik.values.password}
                secureTextEntry={securePassword}
              />
              <Pressable
                onPress={togglePasswordVisibility}
                style={{ position: "absolute", top: 12, right: 8 }}
              >
                {securePassword ? (
                  <FontAwesomeIcon icon={faEye} size={24} color="#FFC857" />
                ) : (
                  <FontAwesomeIcon
                    icon={faEyeSlash}
                    size={24}
                    color="#FFC857"
                  />
                )}
              </Pressable>
            </View>
          </View>
          <View className="flex items-end">
            <Text className="text-saffronMango font-semibold text-[16px]">
              Şifremi unuttum
            </Text>
          </View>
        </View>
        <View style={{ flex: 4 / 9 }}></View>
        <View style={{ flex: 2 / 9 }}>
          <Pressable
            onPress={async (e) => await formik.handleSubmit(e)}
            className="items-center justify-center bg-darkJungleGreen rounded-md h-[50px]"
          >
            <View className="flex flex-row items-center gap-10">
              <Text className="text-white text-[22px] font-light">
                Giriş yap
              </Text>
              {formik.isSubmitting ? (
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <FontAwesomeIcon
                    icon={faArrowsRotate}
                    color="white"
                    size={20}
                  />
                </Animated.View>
              ) : null}
            </View>
          </Pressable>
        </View>
      </View>
      <View className="gap-4 flex-[2]">
        <View className="flex-row items-center justify-center">
          <View className="w-1/4 h-0.5 bg-white"></View>
          <View className="w-2/4 justify-center items-center">
            <Text className="text-white text-[16px]">
              Diğer Giriş Seçenekleri
            </Text>
          </View>
          <View className="w-1/4 h-0.5 bg-white"></View>
        </View>
        <View className="flex-row justify-center gap-4">
          <Pressable>
            <Image source={facebookLogo} className="w-[50] h-[50]" />
          </Pressable>
          <Pressable>
            <Image source={googleLogo} className="w-[50] h-[50]" />
          </Pressable>
        </View>
      </View>

      <View className="flex-[1] flex-row justify-center gap-2">
        <Text className="text-[16px] text-white">Üye değil misiniz ?</Text>
        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text className="text-[16px] text-saffronMango underline">
            Kayıt olun
          </Text>
        </Pressable>
      </View>
    </Container>
  );
}

export default Login;
