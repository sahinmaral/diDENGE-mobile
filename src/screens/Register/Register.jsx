import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View, Image } from "react-native";
import appLogo from "../../../assets/appLogo.png";
import Container from "../../components/Container/Container";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import RegisterUserSchema from "../../schemas/RegisterUserSchema";
import { useToast } from "react-native-toast-notifications";

function Register({ navigation }) {
  const [securePassword, setSecurePassword] = useState({
    password: true,
    passwordConfirm: true,
  });

  const togglePasswordVisibility = (key) => {
    setSecurePassword({ ...securePassword, [key]: !securePassword[key] });
  };

  const toast = useToast();

  const handleSubmit = (values) => {
    const splittedNameAndMiddleName = values.firstName.split(" ");
    const requiredInformations = {
      email: values.email,
      password: values.password,
      firstName: splittedNameAndMiddleName[0],
      lastName: values.lastName,
    };

    if (splittedNameAndMiddleName.length === 2) {
      requiredInformations.middleName = splittedNameAndMiddleName[1];
    }

    navigation.navigate("ContinueRegister", { requiredInformations });
  };

  const formik = useFormik({
    validationSchema: RegisterUserSchema,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

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

  return (
    <Container>
      <View className="flex-[3] justify-center items-center">
        <Image source={appLogo} className="w-[200] h-[75]" contentFit="fill" />
      </View>
      <View className="px-4 flex-[5]">
        <View className="gap-4 flex-[3]">
          <View className="gap-2">
            <View className="flex flex-row items-center">
              <TextInput
                className="border-b border-white text-[16px] pt-2 pb-4 text-white w-5/12"
                placeholderTextColor="white"
                placeholder="Ad"
                onChangeText={formik.handleChange("firstName")}
                onBlur={formik.handleBlur("firstName")}
                value={formik.values.firstName}
              />
              <TextInput
                className="border-b border-white text-[16px] pt-2 pb-4 text-white w-5/12 ml-auto"
                placeholderTextColor="white"
                placeholder="Soyad"
                onChangeText={formik.handleChange("lastName")}
                onBlur={formik.handleBlur("lastName")}
                value={formik.values.lastName}
              />
            </View>
            <TextInput
              className="border-b border-white text-[16px] pt-2 pb-4 text-white"
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
                secureTextEntry={securePassword.password}
              />
              <Pressable
                onPress={() => togglePasswordVisibility("password")}
                style={{ position: "absolute", top: 12, right: 8 }}
              >
                {securePassword.password ? (
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
            <View>
              <TextInput
                className="border-b border-white text-[16px] text-white pt-2 pb-4"
                placeholderTextColor="white"
                placeholder="Şifre Tekrar"
                onChangeText={formik.handleChange("passwordConfirm")}
                onBlur={formik.handleBlur("passwordConfirm")}
                value={formik.values.passwordConfirm}
                secureTextEntry={securePassword.passwordConfirm}
              />
              <Pressable
                onPress={() => togglePasswordVisibility("passwordConfirm")}
                style={{ position: "absolute", top: 12, right: 8 }}
              >
                {securePassword.passwordConfirm ? (
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
        </View>
        <View className="flex-[4]"></View>
        <View className="flex-[2]">
          <Pressable
            onPress={formik.handleSubmit}
            className="items-center justify-center bg-darkJungleGreen rounded-md h-[50px]"
          >
            <Text className="text-white text-[22px] font-light">Kayıt Ol</Text>
          </Pressable>
        </View>
      </View>

      <View className="flex-[2] flex-row justify-center gap-2">
        <Text className="text-[16px] text-white">Üye misiniz ?</Text>
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text className="text-[16px] text-saffronMango underline">
            Giriş yapın
          </Text>
        </Pressable>
      </View>
    </Container>
  );
}

export default Register;
