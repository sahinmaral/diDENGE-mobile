import {
  Text,
  Image,
  Pressable,
  TextInput,
  View,
  Animated,
} from "react-native";
import appLogo from "../../../assets/appLogo.png";
import Container from "../../components/Container/Container";
import { useFormik } from "formik";
import DatePicker from "react-native-date-picker";
import { useEffect, useState } from "react";
import moment from "moment";
import apiService from "../../services/apiService";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import useSpinAnimation from "../../hooks/useSpinAnimation.js";
import { useToast } from "react-native-toast-notifications";
import ContinueRegisterUserSchema from "../../schemas/ContinueRegisterUserSchema.js";
import translatedErrorMessages from "../../locale/index.js";
import ToastOptions from "../../classes/ToastOptions.js";
import ToastTypes from "../../enums/ToastTypes.js";
import { sleep } from "../../utils/timeUtils.js";
import { SUCCESSFULLY_REGISTERED } from "../../constants/messages/index.js";
import ToastService from "../../services/toastService/index.js";

function ContinueRegister({ navigation, route }) {
  const { requiredInformations } = route.params;

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const spin = useSpinAnimation();

  const toast = useToast();
  const toastService = new ToastService(toast);

  const formik = useFormik({
    initialValues: {
      ...requiredInformations,
      birthDate: new Date(),
      phoneNumber: "",
      userName: "",
    },
    validationSchema: ContinueRegisterUserSchema,
    onSubmit: (values) => handleSubmit(values),
  });

  useEffect(() => {
    if (!formik.isValid && !formik.isValidating && formik.isSubmitting) {
      const errorWithStars = Object.values(formik.errors)
        .map((error) => `* ${error}`)
        .join("\n");

      toastService.showToast(
        errorWithStars,
        new ToastOptions(ToastTypes.Warning)
      );
    }
  }, [formik]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleSubmit = async (values) => {
    try {
      await apiService.auth.fetchRegisterUser({
        ...values,
        phoneNumber: `+90${values.phoneNumber}`,
      });

      toastService.showToast(
        SUCCESSFULLY_REGISTERED,
        new ToastOptions(ToastTypes.Success)
      );

      await sleep(3000);

      navigation.navigate("Login");
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        toastService.showToast(
          translatedErrorMessages[data.Detail],
          new ToastOptions(ToastTypes.Danger)
        );
      } else {
        console.log(error);
        toastService.showToast(
          ERROR_DURING_REGISTER,
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
      <View className="px-4 flex-[5]">
        <View className="gap-4 flex-[3]">
          <View>
            <TextInput
              className="border-b border-white text-[16px] pt-2 pb-4 text-white"
              placeholderTextColor="white"
              placeholder="Kullanıcı adı"
              onChangeText={formik.handleChange("userName")}
              onBlur={formik.handleBlur("userName")}
              value={formik.values.userName}
            />
          </View>
          <View>
            <Pressable onPress={showDatePicker}>
              <TextInput
                className="border-b border-white text-[16px] pt-2 pb-4 text-white"
                placeholderTextColor="white"
                placeholder="Doğum Tarihi"
                editable={false}
                value={moment(formik.values.birthDate).format("YYYY-MM-DD")}
              />
            </Pressable>
            <DatePicker
              modal
              mode="date"
              title="Doğum tarihinizi seçiniz"
              confirmText="Seç"
              cancelText="Kapat"
              open={isDatePickerVisible}
              locale="tr"
              maximumDate={new Date()}
              date={new Date(formik.values.birthDate)}
              onConfirm={(date) => {
                const updatedDate = moment(date).format("YYYY-MM-DD");
                formik.handleChange("birthDate", updatedDate);
                formik.setFieldValue("birthDate", updatedDate);
                hideDatePicker();
              }}
              onCancel={hideDatePicker}
            />
          </View>
          <View>
            <TextInput
              className="border-b border-white text-[16px] pt-2 pb-4 text-white"
              placeholderTextColor="white"
              placeholder="(5xx)xxxxxxx"
              keyboardType="number-pad"
              maxLength={10}
              onChangeText={formik.handleChange("phoneNumber")}
              onBlur={formik.handleBlur("phoneNumber")}
              value={formik.values.phoneNumber}
            />
          </View>
        </View>
        <View className="flex-[4]"></View>
        <View className="flex-[2]">
          <Pressable
            disabled={formik.isSubmitting}
            onPress={formik.handleSubmit}
            className="items-center justify-center bg-darkJungleGreen rounded-md h-[50px]"
          >
            <View className="flex flex-row items-center gap-10">
              <Text className="text-white text-[22px] font-light">
                Kaydı Tamamla
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
    </Container>
  );
}

export default ContinueRegister;
