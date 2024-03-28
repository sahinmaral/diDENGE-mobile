import React from "react";
import { Pressable, TextInput, View, Text } from "react-native";

function ToggleNotificationSoundModalContent() {
    return (
      <View className="gap-y-2">
        <Text className="text-black font-medium text-xl justify-center py-2">
          Sesli Bildirim
        </Text>
        <Text className="text-blue-400 font-normal text-lg justify-center py-2">
          Sesli bildirim sayesinde gün içerisinde gelen bildirimleri sesli bir şekilde alabilirsiniz.
        </Text>
        <View className="flex-row mt-8 w-full">
        <Pressable className="flex-1 items-center justify-center bg-saffronMango rounded-md h-[50px] mr-3">
          <Text className="text-white text-[22px] font-medium">Aktif</Text>
        </Pressable>
        <Pressable className="flex-1 items-center justify-center bg-slate-200 rounded-md h-[50px]">
        <Text className="text-slate-500 text-[22px] font-medium">Deaktif</Text>
      </Pressable>
      </View>
      </View>
    );
  }
  
  export default ToggleNotificationSoundModalContent;