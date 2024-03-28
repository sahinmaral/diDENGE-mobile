import { useEffect, useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  Image,
  Animated,
  NativeModules,
} from "react-native";
import logo from "../../../assets/logo.png";
import facebook from "../../../assets/facebook.png";
import google from "../../../assets/google.png";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Container from "../../components/Container/Container";
import { useFormik } from "formik";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useToast } from "react-native-toast-notifications";
import LoginUserSchema from "../../schemas/LoginUserSchema";
import translatedErrorMessages from "../../locale";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import useSpinAnimation from "../../hooks/useSpinAnimation";
import {
  fetchLoginUser,
  fetchGetRandomWordOfTheDay,
  fetchGetAddictionLevelByUserId,
} from "../../services/APIService";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/authSlice";
import { setWordOfTheDay } from "../../redux/slices/appSlice";

const { UsageStats } = NativeModules;

function Login({ navigation }) {
  const [securePassword, setSecurePassword] = useState(true);

  const spin = useSpinAnimation();

  const togglePasswordVisibility = () => {
    setSecurePassword((prev) => !prev);
  };

  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      email: "sahin.maral@hotmail.com",
      password: "Abc1234.",
    },
    validationSchema: LoginUserSchema,
    onSubmit: (values) => handleSubmit(values),
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (!formik.isValid && !formik.isValidating && formik.isSubmitting) {
      const errorWithStars = Object.values(formik.errors)
        .map((error) => `* ${error}`)
        .join("\n");

      toast.show(errorWithStars, {
        type: "warning",
        placement: "top",
      });
    }
  }, [formik]);

  const handleSubmit = async (values) => {
    try {
      const [loginResult, fetchRandomWordOfTheDayResult] = await Promise.all([
        fetchLoginUser({
          userNameOrEmail: values.email,
          password: values.password,
        }),
        fetchGetRandomWordOfTheDay(),
      ]);

      const { data: loggedInUserData } = loginResult;
      const { data: randomWordOfTheDay } = fetchRandomWordOfTheDayResult;

      const { data: userAddictionLevelData } =
        await fetchGetAddictionLevelByUserId(loggedInUserData.id);

      dispatch(
        setUser({ ...loggedInUserData, addictionLevel: userAddictionLevelData })
      );
      dispatch(setWordOfTheDay(randomWordOfTheDay.content));

      toast.show("Başarılı bir şekilde giriş yaptınız", {
        type: "success",
        placement: "top",
      });

      if (loggedInUserData.isNewUser) {
        const hasPermissionOfUsageStats = await UsageStats.checkForPermission();
        if (hasPermissionOfUsageStats)
          navigation.navigate(
            "ExplanationOfSocialMediaAddictiveLevelIdentification"
          );
        else navigation.navigate("CheckPermissionForNewUser");
      } else {
        navigation.navigate("App");
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        toast.show(translatedErrorMessages[data.Detail], {
          type: "danger",
          placement: "top",
        });
      } else {
        toast.show(
          "Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
          {
            type: "danger",
            placement: "top",
          }
        );
      }
    }
  };

  return (
    <Container>
      <View className="flex-[3] justify-center items-center">
        <Image source={logo} className="w-[200] h-[75]" contentFit="fill" />
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
            onPress={formik.handleSubmit}
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
            <Image source={facebook} className="w-[50] h-[50]" />
          </Pressable>
          <Pressable>
            <Image source={google} className="w-[50] h-[50]" />
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
