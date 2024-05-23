import { Pressable, View, Text } from "react-native";
import { useDispatch } from "react-redux";
import { toggleModal } from "../../../redux/slices/modalSlice";
import { clearUser } from "../../../redux/slices/authSlice";
import { useNavigation } from '@react-navigation/native';

function VerifyExitSocialMediaAddictionLevelIdentificationModalContent() {
  const dispatch = useDispatch();
  const navigation = useNavigation()

  return (
    <View className="gap-y-2">
      <Text className="text-black font-medium text-xl justify-center">
        Uyarı
      </Text>
      <Text className="text-funBlue font-medium text-lg justify-center">
        Sosyal medya bağımlılık seviyesi tespit sınavını kapatmak istediğinize
        emin misiniz ?
      </Text>
      <View className="flex-row justify-between pt-4">
        <Pressable
          className="items-center justify-center bg-saffronMango rounded-md h-[40px] w-[150px]"
          onPress={() => {
            dispatch(clearUser());
            dispatch(toggleModal());
            navigation.navigate("Login")
          }}
        >
          <Text className="text-white text-[16px] font-medium">Evet</Text>
        </Pressable>

        <Pressable
          className="items-center justify-center bg-funBlue rounded-md h-[40px] w-[150px]"
          onPress={() => {
            dispatch(toggleModal());
          }}
        >
          <Text className="text-white text-[16px] font-medium">Hayır</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default VerifyExitSocialMediaAddictionLevelIdentificationModalContent;
