import React from "react";
import { Pressable, View, Text } from "react-native";

function UpdateProfileImageModalContent() {
  return (
    <View className="gap-y-2">
      <Text className="text-black font-medium text-xl justify-center py-2 px-5">
        Profil Fotoğrafını Güncelle
      </Text>
      <Pressable className="items-center justify-center bg-saffronMango rounded-md h-[50px]">
        <Text className="text-white text-[22px] font-medium">Fotoğraf Seç</Text>
      </Pressable>
      <Pressable className="items-center justify-center bg-funBlue rounded-md h-[50px]">
        <Text className="text-white text-[22px] font-medium">Temizle</Text>
      </Pressable>
    </View>
  );
}

export default UpdateProfileImageModalContent;
