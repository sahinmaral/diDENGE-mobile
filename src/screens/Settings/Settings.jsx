import Container from "../../components/Container/Container";
import { View } from "react-native";
import { useEffect, useMemo } from "react";
import GoBackButton from "../../components/GoBackButton";
import MenuItem from "../../components/MenuItem/MenuItem";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import ModalContentTypes from "../../enums/ModalContentTypes";
import { setModalContent } from "../../redux/slices/modalSlice";
import { selectUser } from "../../redux/slices/authSlice";

function Settings({ updateCurrentScreen }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const isDoNotDisturbEnabled = useMemo(() => {
    if (user && user.isDoNotDisturbEnabled) {
      return true;
    }

    return false;
  }, [user]);

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
        {/* <MenuItem
          header="Sesli Bildirim"
          subHeader="Aktif"
          onPress={() => {
            dispatch(
              setModalContent(ModalContentTypes.ToggleNotificationSound)
            );
          }}
        /> */}
        {/* <MenuItem
          header="Odak Mod"
          subHeader={isDoNotDisturbEnabled ? "Aktif" : "Deaktif"}
          onPress={() => {
            if (isDoNotDisturbEnabled) {
              dispatch(setModalContent(ModalContentTypes.CloseFocusMode));
            } else {
              dispatch(setModalContent(ModalContentTypes.SetFocusMode));
            }
          }}
        /> */}
      </View>
      <View className="flex-[2]">
        <MenuItem
          header="İletişime Geçin"
          onPress={() => navigation.navigate("ContactUs")}
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
