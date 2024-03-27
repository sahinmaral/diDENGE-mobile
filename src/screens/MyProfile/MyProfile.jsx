import Container from "../../components/Container/Container";
import GoBackButton from "../../components/GoBackButton";
import {
  View,
  Text,
  Image,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import MenuItem from "../../components/MenuItem/MenuItem";
import defaultUserImage from "../../../assets/default-user.png";
import { useState } from "react";
import ModalContainer from "../../components/Container/ModalContainer";

function MyProfile({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeModal, setActiveModal] = useState("name");
  const handleUpdatePress = (type) => {
    setActiveModal(type);
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
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
          onPress={() => handleUpdatePress("name")}
        />
        <MenuItem
          header="Şifreni güncelle"
          onPress={() => handleUpdatePress("password")}
        />
        <MenuItem
          header="Profil resmini güncelle"
          onPress={() => handleUpdatePress("picture")}
        />
        <Modal visible={modalVisible} onRequestClose={handleCloseModal} animationType="slide">
          {activeModal === "name" && (
            <ModalContainer handleCloseModal={handleCloseModal}>
              <View className="gap-y-2">
                <Text className="text-black font-medium text-xl justify-center py-2 px-5">
                  Ad Soyad Bilgilerini Güncelle
                </Text>
                <TextInput
                  className="text-[16px]  py-2 bg-gray-100 text-left px-3"
                  placeholder="Adiniz"
                />
                <TextInput
                  className="text-[16px]  py-2 bg-gray-100 text-left px-3"
                  placeholder="Soyadiniz"
                />
                <Pressable className="items-center justify-center bg-saffronMango rounded-md h-[50px]">
                  <Text className="text-white text-[22px] font-medium">
                    Güncelle
                  </Text>
                </Pressable>
              </View>
            </ModalContainer>
          )}
          {activeModal === "password" && (
            <ModalContainer handleCloseModal={handleCloseModal}>
              <View className="gap-y-2">
                <Text className="text-black font-medium text-xl justify-center py-2 px-5">
                  Şifreni Güncelle
                </Text>
                <TextInput
                  className="text-[16px]  py-2 bg-gray-100 text-left px-3"
                  placeholder="Mevcut Şifre"
                />
                <TextInput
                  className="text-[16px]  py-2 bg-gray-100 text-left px-3"
                  placeholder="Yeni Şifre"
                />
                <TextInput
                  className="text-[16px]  py-2 bg-gray-100 text-left px-3"
                  placeholder="Yeni Şifre Tekrarı"
                />
                <Pressable className="items-center justify-center bg-saffronMango rounded-md h-[50px]">
                  <Text className="text-white text-[22px] font-medium">
                    Güncelle
                  </Text>
                </Pressable>
              </View>
            </ModalContainer>
          )}
          {activeModal === "picture" && (
            <ModalContainer handleCloseModal={handleCloseModal}>
              <View className="gap-y-2">
                <Text className="text-black font-medium text-xl justify-center py-2 px-5">
                  Profil Fotoğrafını Güncelle
                </Text>
                <Pressable className="items-center justify-center bg-saffronMango rounded-md h-[50px]">
                  <Text className="text-white text-[22px] font-medium">
                    Fotoğraf Seç
                  </Text>
                </Pressable>
                <Pressable className="items-center justify-center bg-funBlue rounded-md h-[50px]">
                  <Text className="text-white text-[22px] font-medium">
                    Temizle
                  </Text>
                </Pressable>
              </View>
            </ModalContainer>
          )}
        </Modal>
      </View>
    </Container>
  );
}

export default MyProfile;
