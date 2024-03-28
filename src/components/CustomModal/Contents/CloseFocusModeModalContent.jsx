import React from "react";
import { Pressable, TextInput, View, Text } from "react-native";

function CloseFocusModeModalContent() {
    return (
      <View className="gap-y-2">
        <Text className="text-black font-medium text-xl justify-center py-2">
          Odak Mod
        </Text>
        <Text className="text-blue-400 font-normal text-lg justify-center py-2">
          Odak modu kapatmak istediğinize emin misiniz ?
        </Text>
        <View className="flex-row mt-8 w-full">
        <Pressable className="flex-1 items-center justify-center bg-saffronMango rounded-md h-[50px] mr-3">
          <Text className="text-white text-[22px] font-medium">Evet</Text>
        </Pressable>
        <Pressable className="flex-1 items-center justify-center bg-funBlue rounded-md h-[50px]">
        <Text className="text-white text-[22px] font-medium">Hayır</Text>
      </Pressable>
      </View>
      </View>
    );
  }
  
  export default CloseFocusModeModalContent;