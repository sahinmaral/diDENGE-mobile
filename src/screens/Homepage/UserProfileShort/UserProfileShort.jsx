import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import defaultUserImage from "../../../../assets/default-user.png";
import { Pressable, Image, View, Text } from "react-native";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/slices/authSlice";
import { useMemo } from "react";

function UserProfileShort() {
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
          uri: `${process.env.CLOUDINARY_IMAGE_PATH}/${user.profilePhotoURL}`,
        }
      : defaultUserImage;
  }, [user]);

  return (
    <View className="flex flex-row justify-between items-center">
      <View className="flex flex-row items-center space-x-4">
        <Image
          source={userProfileImage}
          className="w-[60px] h-[60px] rounded-full"
        />
        <View>
          <Text className="text-saffronMango">Hoşgeldin</Text>
          <Text className="text-white text-[18px] font-medium">
            {userFullName}
          </Text>
        </View>
      </View>

      <View>
        <Pressable
          className="bg-saffronMango h-[50px] w-[50px] rounded-full items-center justify-center"
          onPress={() => navigation.navigate("MyProfile")}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} size={20} color="black" />
        </Pressable>
      </View>
    </View>
  );
}

export default UserProfileShort;
