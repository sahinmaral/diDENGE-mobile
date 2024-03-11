import { useState } from "react";
import { Pressable, Text, TextInput, View, Image } from "react-native";
import logo from "../../../assets/logo.png";
import Container from "../../components/Container/Container";
import { Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

function Register({ navigation }) {
  const [securePassword, setSecurePassword] = useState({
    password: true,
    passwordConfirm: true,
  });

  const togglePasswordVisibility = (key) => {
    setSecurePassword({ ...securePassword, [key]: !securePassword[key] });
  };

  const formInitialValues = {
    nameAndSurname: "",
    email: "",
    password: "",
    passwordConfirm: "",
  };

  return (
    <Container>
      <View className="flex-[3] justify-center items-center">
        <Image source={logo} className="w-[200] h-[75]" contentFit="fill" />
      </View>
      <Formik
        initialValues={formInitialValues}
        onSubmit={(values) => console.log(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View className="px-4 flex-[5]">
            <View className="gap-4 flex-[3]">
              <View className="gap-2">
                <TextInput
                  className="border-b border-white text-[16px] pt-2 pb-4 text-white"
                  placeholderTextColor="white"
                  placeholder="Ad soyad"
                  onChangeText={handleChange("nameAndSurname")}
                  onBlur={handleBlur("nameAndSurname")}
                  value={values.nameAndSurname}
                />
                <TextInput
                  className="border-b border-white text-[16px] pt-2 pb-4 text-white"
                  placeholderTextColor="white"
                  placeholder="E-posta adresi"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                />
                <View>
                  <TextInput
                    className="border-b border-white text-[16px] text-white pt-2 pb-4"
                    placeholderTextColor="white"
                    placeholder="Şifre"
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
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
                    onChangeText={handleChange("passwordConfirm")}
                    onBlur={handleBlur("passwordConfirm")}
                    value={values.passwordConfirm}
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
                onPress={handleSubmit}
                className="items-center justify-center bg-darkJungleGreen rounded-md h-[50px]"
              >
                <Text className="text-white text-[22px] font-light">
                  Kayıt Ol
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </Formik>
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
