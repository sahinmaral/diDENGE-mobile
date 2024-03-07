import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import logo from "../../../assets/logo.png";
import facebook from "../../../assets/facebook.png";
import google from "../../../assets/google.png";
import { Image } from "expo-image";
import { FontAwesome } from "@expo/vector-icons";
import Container from "../../components/Container/Container";
import { Formik } from "formik";

function Login({ navigation }) {
  const [securePassword, setSecurePassword] = useState(true);

  const togglePasswordVisibility = () => {
    setSecurePassword((prev) => !prev);
  };
  
  const formInputValues = {
    email: "",
    password: "",
  };
  
  return (
    <Container>
      <View className="flex-[3] justify-center items-center">
        <Image source={logo} className="w-[200] h-[75]" contentFit="fill" />
      </View>
      <Formik
        initialValues={formInputValues}
        onSubmit={(values) => console.log(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
      <View className="px-4 flex-[4]">
        <View style={{ flex: 3 / 9 }} className="gap-4">
          <View className="gap-2">
            <TextInput
              className="border-b border-white text-[16px] text-white pt-2 pb-4"
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
                onPress={togglePasswordVisibility}
                style={{ position: "absolute", top: 12, right: 8 }}
              >
                {securePassword ? (
                  <FontAwesome name="eye" size={24} color="#FFC857" />
                ) : (
                  <FontAwesome name="eye-slash" size={24} color="#FFC857" />
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
          <Pressable onPress={handleSubmit} className="items-center justify-center bg-darkJungleGreen rounded-md h-[50px]">
            <Text className="text-white text-[22px] font-light">Giriş yap</Text>
          </Pressable>
        </View>
      </View>
          )}
          </Formik>
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
            <Image
              source={facebook}
              className="w-[50] h-[50]"
              contentFit="fill"
            />
          </Pressable>
          <Pressable>
            <Image
              source={google}
              className="w-[50] h-[50]"
              contentFit="fill"
            />
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
