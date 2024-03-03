import Container from "../../components/Container/Container";
import { View, Text } from "react-native";
import { useEffect } from "react";
import GoBackButton from "../../components/GoBackButton";
import { AntDesign } from "@expo/vector-icons";
import MenuItem from "../../components/MenuItem/MenuItem";

function Settings({ navigation, updateCurrentScreen }) {
  useEffect(() => {
    updateCurrentScreen("Settings");
  }, []);

  return (
    <Container customClasses="px-4">
      <GoBackButton navigation={navigation} header="Ayarlar" />
      <View className="flex-[6]">
        <View className="flex flex-row justify-between border-b border-white py-4">
          <Text className="text-white text-lg">Dil</Text>
          <View className="flex flex-row gap-4 items-center">
            <Text className="text-white text-lg">Türkçe</Text>
            <AntDesign name="right" size={20} color="#FFC857" />
          </View>
        </View>
        <View className="flex flex-row justify-between border-b border-white py-4">
          <Text className="text-white text-lg">Profilim</Text>
          <View className="flex flex-row gap-4 items-center">
            <AntDesign name="right" size={20} color="#FFC857" />
          </View>
        </View>
        <View className="flex flex-row justify-between border-b border-white py-4">
          <Text className="text-white text-lg">Sesli Bildirim</Text>
          <View className="flex flex-row gap-4 items-center">
            <Text className="text-white text-lg">Aktif</Text>
            <AntDesign name="right" size={20} color="#FFC857" />
          </View>
        </View>
        <View className="flex flex-row justify-between border-b border-white py-4">
          <Text className="text-white text-lg">Odak Mod</Text>
          <View className="flex flex-row gap-4 items-center">
            <Text className="text-white text-lg">Aktif</Text>
            <AntDesign name="right" size={20} color="#FFC857" />
          </View>
        </View>
      </View>
      <View className="flex-[2]">
        <MenuItem header="İletişime Geçin" />
        <MenuItem header="Gizlilik Sözleşmesi" />
      </View>
    </Container>
  );
}

export default Settings;
