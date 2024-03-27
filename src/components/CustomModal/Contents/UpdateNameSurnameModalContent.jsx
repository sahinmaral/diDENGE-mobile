import { Pressable, TextInput, View, Text } from "react-native";

function UpdateNameSurnameModalContent() {
  return (
    <View className="gap-y-2">
      <Text className="text-black font-medium text-xl justify-center py-2 px-5">
        Ad Soyad Bilgilerini Güncelle
      </Text>
      <TextInput
        className="text-[16px]  py-2 bg-gray-100 text-left px-3"
        placeholder="Adınız"
      />
      <TextInput
        className="text-[16px]  py-2 bg-gray-100 text-left px-3"
        placeholder="Soyadınız"
      />
      <Pressable className="items-center justify-center bg-saffronMango rounded-md h-[50px]">
        <Text className="text-white text-[22px] font-medium">Güncelle</Text>
      </Pressable>
    </View>
  );
}

export default UpdateNameSurnameModalContent;
