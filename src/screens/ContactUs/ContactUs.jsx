import Container from "../../components/Container/Container";
import { TextInput, View, Text, Pressable } from "react-native";
import GoBackButton from "../../components/GoBackButton";
import DropdownComponent from "./DropdownComponent";
import { selectUser } from "../../redux/slices/authSlice";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useFormik } from "formik";
import LoadingSpin from "../../components/LoadingSpin";
import apiService from "../../services/apiService";
import translatedErrorMessages from "../../locale";
import {
  ERROR_DURING_CONTACTUS,
  SUCCESSFULLY_SENT_CONTACTUS,
} from "../../constants/messages";
import ToastTypes from "../../enums/ToastTypes";
import ToastOptions from "../../classes/ToastOptions";
import { useToast } from "react-native-toast-notifications";
import ToastService from "../../services/toastService";

function ContactUs({ navigation }) {
  const user = useSelector(selectUser);
  const toast = useToast();
  const toastService = new ToastService(toast);

  const dropdownData = [
    { label: "Teşekkür", value: "1" },
    { label: "Şikayet", value: "2" },
    { label: "Diğer", value: "3" },
  ];

  const [selectedReportType, setSelectedReportType] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: user.email,
      nameSurname: user.firstName.concat(` ${user.lastName}`),
      reportType: null,
      content: "",
    },
    onSubmit: async (values) => await handleSubmit(values),
  });

  const handleSubmit = async (values) => {
    try {
      const requestBody = {
        ...values,
        reportType: dropdownData.find(
          (data) => data.value === selectedReportType
        ).label,
      };

      await apiService.users.fetchContactUs(requestBody);

      toastService.showToast(
        SUCCESSFULLY_SENT_CONTACTUS,
        new ToastOptions(ToastTypes.Success)
      );

      navigation.navigate("Homepage");
    } catch (error) {
      console.log(error);
      if (error.response) {
        const { data } = error.response;

        toastService.showToast(
          translatedErrorMessages[data.Detail],
          new ToastOptions(ToastTypes.Danger)
        );
      } else {
        toastService.showToast(
          ERROR_DURING_CONTACTUS,
          new ToastOptions(ToastTypes.Danger)
        );
      }
    } finally {
      formik.setSubmitting(false);
    }
  };

  return (
    <Container customClasses="px-4">
      <GoBackButton navigation={navigation} header="İletişime Geçin" />
      <View className="flex-[1]"></View>
      <View className="flex-[10]">
        <View className="gap-y-4">
          <View className="gap-y-2">
            <TextInput
              className="text-[16px] py-2 bg-gray-100 text-left px-5"
              value={formik.values.nameSurname}
              readOnly={true}
            />
            <TextInput
              className="text-[16px]  py-2 bg-gray-100 text-left px-5"
              value={user.email}
              readOnly={true}
            />
            <Text className="text-white text-[15px] font-medium">
              Sorun Tipi
            </Text>
            <DropdownComponent
              data={dropdownData}
              setValue={setSelectedReportType}
              value={selectedReportType}
            />
            <TextInput
              textAlignVertical="top"
              className="text-[16px] py-2 bg-gray-100 text-left px-5 h-60"
              placeholderTextColor="gray"
              placeholder="İçerik"
              multiline={true}
              numberOfLines={4}
              onChangeText={formik.handleChange("content")}
              onBlur={formik.handleBlur("content")}
              value={formik.values.content}
            />
          </View>
        </View>
        <View className="flex-[2] py-2">
          <Pressable
            className="flex-row items-center justify-center bg-saffronMango rounded-md h-[50px]"
            onPress={async (e) => await formik.handleSubmit(e)}
          >
            <Text className="text-white text-[22px] font-medium">Gönder</Text>
            {formik.isSubmitting ? (
              <LoadingSpin spinStatus={formik.isSubmitting} />
            ) : null}
          </Pressable>
        </View>
      </View>
    </Container>
  );
}

export default ContactUs;
