import { useCallback, useEffect, useMemo, useState } from "react";
import { Animated, BackHandler, Pressable, Text, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import Container from "../../components/Container/Container";
import OtpVerificationLogo from "../../../assets/otp-verification.svg";
import styles from "./SendOtpVerification.styles";
import apiService from "../../services/apiService";
import useSpinAnimation from "../../hooks/useSpinAnimation";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "react-native-toast-notifications";
import ToastService from "../../services/toastService";
import ToastTypes from "../../enums/ToastTypes";
import ToastOptions from "../../classes/ToastOptions";
import ModalContentTypes from "../../enums/ModalContentTypes";
import { useDispatch,useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { setModalContent } from "../../redux/slices/modalSlice";
import { clearUser, selectUser } from "../../redux/slices/authSlice";

function SendOtpVerification({ navigation, route }) {
  const { userId } = route.params;

  const user = useSelector(selectUser)

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [remaining, setRemaining] = useState(120);

  const spin = useSpinAnimation();
  const toast = useToast();
  const dispatch = useDispatch();

  const toastService = new ToastService(toast);

  const stringifiedTimer = useMemo(() => {
    let minutes = Math.floor(remaining / 60);
    minutes = minutes % 10 === minutes ? `0${minutes}` : minutes;

    let seconds =
      remaining % 60 === 0 ? 0 : remaining > 60 ? remaining - 60 : remaining;
    seconds = seconds % 10 === seconds ? `0${seconds}` : seconds;

    return `${minutes}:${seconds}`;
  }, [remaining]);

  const handleSendVerificationCode = async () => {
    try {
      setIsLoading(true);
      await apiService.auth.fetchSendVerificationCode({
        userId,
      });
    } catch (error) {
      toastService.showToast(
        "Hesap onay kodu gönderirken bir sorun yaşandı. Lütfen tekrar deneyiniz.",
        new ToastOptions(ToastTypes.Warning)
      );

      if(user){
        dispatch(clearUser())
      }

      navigation.navigate("Login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyVerificationCode = async () => {
    try {
      setIsLoading(true);
      await apiService.auth.fetchVerifyVerificationCode({
        userId,
        code,
      });

      toastService.showToast(
        "Hesabınız başarılı bir şekilde onaylanmıştır. Tekrardan giriş yapabilirsiniz.",
        new ToastOptions(ToastTypes.Success)
      );
    } catch (error) {
      toastService.showToast(
        "Hesap onay kodunu onaylarken bir sorun yaşandı. Lütfen tekrar deneyiniz.",
        new ToastOptions(ToastTypes.Warning)
      );
    } finally {
      if(user){
        dispatch(clearUser())
      }
      navigation.navigate("Login");
      setIsLoading(false);
    }
  };

  const handleHardwareBackPress = () => {
    dispatch(
      setModalContent(
        ModalContentTypes.VerifyExitSendVerificationCodeModalContent
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

  useEffect(() => {
    handleSendVerificationCode()
  },[])

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(remaining - 1);
    }, 1000);

    if (remaining === 0) {
      clearInterval(interval);
      toastService.showToast(
        "Onay kodunuzu girme süreniz doldu. Eğer kod gelmediyse aşağıdaki tekrar gönder seçeneğine basabilirsin.",
        new ToastOptions(ToastTypes.Warning)
      );
    }

    return () => clearInterval(interval);
  }, [remaining]);

  return (
    <Container customClasses="py-12">
      <View className="flex-[2.5] relative">
        <View className="w-full h-[400] rounded-[200px] opacity-[0.4] bg-white absolute bottom-[60]"></View>
        <View className="w-[300] h-[300] rounded-[150px] opacity-[0.6] bg-white absolute bottom-[100] left-[120]"></View>
        <View className="absolute top-[0] bottom-0 left-0 right-0 items-center justify-center">
          <View className="w-[210] h-[210] rounded-[110px] bg-white"></View>
        </View>
        <View className="absolute -top-[20] bottom-0 left-4 right-0 items-center justify-center">
          <OtpVerificationLogo width={210} height={210} />
        </View>
      </View>
      <View className="flex-[3.5] px-4">
        <View className="flex-[1]">
          <Text className="text-white text-center text-base">
            Size bu cep telefonu numarasına tek kullanımlık bir onay kodu
            göndereceğiz.
          </Text>
          <Text className="text-white text-center text-base mt-2 font-bold">
            +90 - 5385526462
          </Text>

          <Text className="text-white font-bold text-lg mt-4 text-center">
            {stringifiedTimer}
          </Text>
        </View>

        <View className="flex-[1]">
          <OtpInput
            numberOfDigits={6}
            focusColor="#FFC857"
            onTextChange={(text) => setCode(text)}
            theme={{
              pinCodeTextStyle: styles.pinCodeText,
              pinCodeContainerStyle: styles.pinCodeContainer,
            }}
          />
        </View>
      </View>

      <View className="flex-[1] gap-5 px-4">
        <Pressable
          onPress={handleVerifyVerificationCode}
          className="items-center justify-center bg-darkJungleGreen rounded-md h-[50px]"
        >
          <View className="flex flex-row items-center gap-10">
            <Text className="text-white text-[22px] font-light">Gönder</Text>
            {isLoading ? (
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
        <Pressable
          className="justify-center flex-row"
          onPress={handleSendVerificationCode}
        >
          <Text className="text-white">Kod gelmedi mi ? </Text>
          <Text className="text-white font-semibold text-saffronMango">
            Tekrar gönder
          </Text>
        </Pressable>
      </View>
    </Container>
  );
}

export default SendOtpVerification;
