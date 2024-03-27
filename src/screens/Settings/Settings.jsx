import Container from "../../components/Container/Container";
import { View } from "react-native";
import { useEffect } from "react";
import GoBackButton from "../../components/GoBackButton";
import MenuItem from "../../components/MenuItem/MenuItem";
import { useNavigation } from "@react-navigation/native";

function Settings({ updateCurrentScreen }) {
  const navigation = useNavigation();

  useEffect(() => {
    updateCurrentScreen("Settings");
  }, []);

  return (
    <Container customClasses="px-4">
      <GoBackButton navigation={navigation} header="Ayarlar" />
      <View className="flex-[6]">
        <MenuItem header="Dil" subHeader="Türkçe" onPress={() => {}} />
        <MenuItem
          header="Profilim"
          onPress={() => navigation.navigate("MyProfile")}
        />
        <MenuItem
          header="Sesli Bildirim"
          subHeader="Aktif"
          onPress={() => {}}
        />
        <MenuItem header="Odak Mod" subHeader="Aktif" onPress={() => {}} />
      </View>
      <View className="flex-[2]">
        <MenuItem
          header="İletişime Geçin"
          onPress={() => navigation.navigate("ContactForm")}
        />
        <MenuItem
          header="Gizlilik Sözleşmesi"
          onPress={() => navigation.navigate("PrivacyPolicy")}
        />
      </View>
    </Container>
  );
}

export default Settings;
