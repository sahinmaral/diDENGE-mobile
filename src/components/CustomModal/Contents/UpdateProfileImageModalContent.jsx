import React from "react";
import { Pressable, View, Text } from "react-native";

function UpdateProfileImageModalContent() {
  return (
    <View className="gap-y-2">
      <Text className="text-black font-medium text-xl justify-center py-2">
        Profil Fotoğrafını Güncelle
      </Text>
      <View className="flex-row mt-8 w-full">
      <Pressable className="flex-1 items-center justify-center bg-saffronMango rounded-md h-[50px] mr-3">
        <Text className="text-white text-[22px] font-medium">Fotoğraf Seç</Text>
      </Pressable>
      <Pressable className="flex-1 items-center justify-center bg-funBlue rounded-md h-[50px]">
        <Text className="text-white text-[22px] font-medium">Temizle</Text>
      </Pressable>
    </View>
    </View>
  );
}

export default UpdateProfileImageModalContent;
