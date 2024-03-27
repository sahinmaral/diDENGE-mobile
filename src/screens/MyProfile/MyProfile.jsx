import Container from "../../components/Container/Container";
import GoBackButton from "../../components/GoBackButton";
import { View, Text, Image } from "react-native";
import MenuItem from "../../components/MenuItem/MenuItem";
import defaultUserImage from "../../../assets/default-user.png";
import { useDispatch } from "react-redux";
import { setModalContent } from "../../redux/slices/modalSlice";
import ModalContentTypes from "../../enums/ModalContentTypes";

function MyProfile({ navigation }) {
  const dispatch = useDispatch();

  const handlePressMenuItem = (modalContent) => {
    dispatch(setModalContent(modalContent));
  };

  return (
    <Container customClasses="px-4">
      <GoBackButton navigation={navigation} header="Profilim" />
      <View className="flex-[1] flex-row gap-x-5 items-center">
        <Image source={defaultUserImage} className="w-[80px] h-[80px]" />
        <View className="flex flex-col">
          <Text className="text-xl text-white font-medium">
            Ebubekir Sıddık
          </Text>
          <Text className="text-saffronMango">ebubekirsiddik@gmail.com</Text>
        </View>
      </View>
      <View className="flex-[1.5]"></View>
      <View className="flex-[6]">
        <MenuItem
          header="Ad soyad bilgilerini güncelle"
          onPress={() =>
            handlePressMenuItem(ModalContentTypes.UpdateNameSurname)
          }
        />
        <MenuItem
          header="Şifreni güncelle"
          onPress={() => handlePressMenuItem(ModalContentTypes.UpdatePassword)}
        />
        <MenuItem
          header="Profil resmini güncelle"
          onPress={() =>
            handlePressMenuItem(ModalContentTypes.UpdateProfileImage)
          }
        />
      </View>
    </Container>
  );
}

export default MyProfile;
