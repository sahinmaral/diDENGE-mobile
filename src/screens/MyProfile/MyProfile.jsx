import Container from "../../components/Container/Container";
import GoBackButton from "../../components/GoBackButton";
import { View, Text, Image } from "react-native";
import MenuItem from "../../components/MenuItem/MenuItem";
import defaultUserImage from "../../../assets/default-user.png";
import { useDispatch, useSelector } from "react-redux";
import { setModalContent } from "../../redux/slices/modalSlice";
import ModalContentTypes from "../../enums/ModalContentTypes";
import { selectUser } from "../../redux/slices/authSlice";
import { useMemo } from "react";

function MyProfile({ navigation }) {
  const dispatch = useDispatch();

  const handlePressMenuItem = (modalContent) => {
    dispatch(setModalContent(modalContent));
  };

  const user = useSelector(selectUser);

  const userFullName = useMemo(() => {
    if (user.middleName) {
      return `${user.firstName} ${user.middleName} ${user.lastName}`;
    } else {
      return `${user.firstName} ${user.lastName}`;
    }
  }, [user]);

  const userProfileImage = useMemo(() => {
    return user.profilePhotoURL
      ? {
          uri: `https://res.cloudinary.com/sahinmaral/${user.profilePhotoURL}`,
        }
      : defaultUserImage;
  }, [user]);

  return (
    <Container customClasses="px-4">
      <GoBackButton navigation={navigation} header="Profilim" />
      <View className="flex-[1] flex-row gap-x-5 items-center">
        <Image
          source={userProfileImage}
          className="w-[80px] h-[80px] rounded-full"
        />
        <View className="flex flex-col">
          <Text className="text-xl text-white font-medium">{userFullName}</Text>
          <Text className="text-saffronMango">{user.email}</Text>
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

        <MenuItem
          header="Odak Mod Kapat"
          onPress={() => handlePressMenuItem(ModalContentTypes.CloseFocusMode)}
        />
        <MenuItem
          header="Sesli Bidilrim Kapat"
          onPress={() =>
            handlePressMenuItem(ModalContentTypes.ToggleNotificationSound)
          }
        />
        <MenuItem
          header="Odak Modu Ayarla"
          onPress={() => handlePressMenuItem(ModalContentTypes.SetFocusMode)}
        />
      </View>
    </Container>
  );
}

export default MyProfile;
