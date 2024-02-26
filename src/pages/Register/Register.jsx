import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import logo from "../../../assets/logo.png";
import { Image } from "expo-image";
import { FontAwesome } from "@expo/vector-icons";
import Container from "../../components/Container/Container";

function Register({ navigation }) {
  const [securePassword, setSecurePassword] = useState({
    password: true,
    passwordConfirm: true,
  });

  const togglePasswordVisibility = (key) => {
    setSecurePassword({ ...securePassword, [key]: !securePassword[key] });
  };

  return (
    <Container>
      <View className="flex-[3] justify-center items-center">
        <Image source={logo} className="w-[200] h-[75]" contentFit="fill" />
      </View>

      <View className="px-4 flex-[5]">
        <View className="gap-4 flex-[3]">
          <View className="gap-2">
            <TextInput
              className="border-b border-white text-[16px] pt-2 pb-4"
              placeholderTextColor="white"
              placeholder="Ad soyad"
            />
            <TextInput
              className="border-b border-white text-[16px] pt-2 pb-4"
              placeholderTextColor="white"
              placeholder="E-posta adresi"
            />
            <View>
              <TextInput
                className="border-b border-white text-[16px] text-white pt-2 pb-4"
                placeholderTextColor="white"
                placeholder="Şifre"
                secureTextEntry={securePassword.password}
              />
              <Pressable
                onPress={() => togglePasswordVisibility("password")}
                style={{ position: "absolute", top: 12, right: 8 }}
              >
                {securePassword.password ? (
                  <FontAwesome name="eye" size={24} color="#FFC857" />
                ) : (
                  <FontAwesome name="eye-slash" size={24} color="#FFC857" />
                )}
              </Pressable>
            </View>
            <View>
              <TextInput
                className="border-b border-white text-[16px] text-white pt-2 pb-4"
                placeholderTextColor="white"
                placeholder="Şifre Tekrar"
                secureTextEntry={securePassword.passwordConfirm}
              />
              <Pressable
                onPress={() => togglePasswordVisibility("passwordConfirm")}
                style={{ position: "absolute", top: 12, right: 8 }}
              >
                {securePassword.passwordConfirm ? (
                  <FontAwesome name="eye" size={24} color="#FFC857" />
                ) : (
                  <FontAwesome name="eye-slash" size={24} color="#FFC857" />
                )}
              </Pressable>
            </View>
          </View>
        </View>
        <View className="flex-[4]"></View>
        <View className="flex-[2]">
          <Pressable className="items-center justify-center bg-darkJungleGreen rounded-md h-[50px]">
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
