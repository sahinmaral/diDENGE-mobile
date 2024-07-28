import React, { useCallback, useMemo, useState } from "react";
import { Pressable, View, Text, Image } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { useToast } from "react-native-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "../../../redux/slices/authSlice";
import { toggleModal } from "../../../redux/slices/modalSlice";
import defaultUserImage from "../../../../assets/default-user.png";
import apiService from "../../../services/apiService";
import LoadingSpin from "../../LoadingSpin";

function UpdateProfileImageModalContent() {
  const [form, setForm] = useState({
    values: {
      profileImage: null,
    },
    isSubmitting: false,
  });

  const user = useSelector(selectUser);
  const toast = useToast();
  const dispatch = useDispatch();

  const openImageLibrary = () => {
    let options = {
      storageOptions: {
        path: "image",
      },
    };

    launchImageLibrary(options, (response) => {
      if (response.error) {
        toast.show(
          "Profil resmi seçerken hata oluştu. Lütfen daha sonra tekrar deneyin",
          {
            type: "danger",
            placement: "top",
          }
        );
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        let imageType = response.type || response.assets?.[0]?.type;
        let imageFileName = response.fileName || response.assets?.[0]?.fileName;
        let imageName = response.fileName || response.assets?.[0]?.fileName;

        setProfileImageAtFormState({
          uri: imageUri,
          type: imageType,
          fileName: imageFileName,
          name: imageName,
        });
      }
    });
  };

  const setProfileImageAtFormState = (profileImage) => {
    setForm({ ...form, values: { ...form.values, profileImage } });
  };

  const handleSubmitImage = () => {
    const formData = new FormData();

    formData.append("image", {
      name: form.values.profileImage.fileName,
      type: form.values.profileImage.type,
      uri: form.values.profileImage.uri,
    });

    setForm({ ...form, isSubmitting: true });

    apiService.users
      .fetchUpdateProfileImage(formData, user.id, user.accessToken)
      .then((response) => {
        const newProfilePhotoURL = response.data.newProfileImagePath;
        dispatch(setUser({ ...user, profilePhotoURL: newProfilePhotoURL }));

        toast.show("İşlem başarılı", {
          type: "success",
          placement: "top",
        });
      })
      .catch((error) => {
        toast.show(
          "Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
          {
            type: "danger",
            placement: "top",
          }
        );
      })
      .finally(() => {
        setForm({ ...form, isSubmitting: false });
        dispatch(toggleModal());
      });
  };

  const handleDeleteProfileImage = () => {
    setForm({ ...form, isSubmitting: true });

    apiService.users
      .fetchDeleteProfileImage(user.id, user.accessToken)
      .then((response) => {
        dispatch(setUser({ ...user, profilePhotoURL: null }));

        toast.show("İşlem başarılı", {
          type: "success",
          placement: "top",
        });
      })
      .catch((error) => {
        toast.show(
          "Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
          {
            type: "danger",
            placement: "top",
          }
        );
      })
      .finally(() => {
        setForm({ ...form, isSubmitting: false });
        dispatch(toggleModal());
      });
  };

  const handlePress = useCallback(() => {
    if (!form.values.profileImage) openImageLibrary();
    else handleSubmitImage();
  }, [form.values.profileImage]);

  const handleClearImage = () => {
    if (!form.values.profileImage) {
      if (!user.profilePhotoURL) {
        toast.show("Herhangi bir fotoğraf seçmediniz", {
          type: "danger",
          placement: "top",
        });
      } else {
        handleDeleteProfileImage();
      }
    } else {
      setProfileImageAtFormState(null);
    }
  };

  const userProfileImage = useMemo(() => {
    if (form.values.profileImage) {
      return {
        uri: form.values.profileImage.uri,
      };
    } else {
      if (user.profilePhotoURL) {
        return {
          uri: `https://res.cloudinary.com/sahinmaral/${user.profilePhotoURL}`,
        };
      } else {
        return defaultUserImage;
      }
    }
  }, [user.profilePhotoURL, form.values.profileImage]);

  return (
    <View className="gap-y-2">
      <Text className="text-black font-medium text-xl justify-center py-2">
        Profil Fotoğrafını Güncelle
      </Text>
      <View className="items-center py-5">
        <Image
          source={userProfileImage}
          className="w-[100px] h-[100px] rounded-full"
        />
        {form.isSubmitting ? (
          <LoadingSpin spinStatus={form.isSubmitting} />
        ) : null}
      </View>
      <View className="flex-row mt-8 w-full">
        <Pressable
          className={`flex-1 items-center justify-center bg-saffronMango rounded-md h-[50px] mr-3 ${
            form.isSubmitting ? "opacity-50" : "opacity-100"
          }`}
          onPress={handlePress}
          disabled={form.isSubmitting}
        >
          <Text className="text-white text-[22px] font-medium">
            {form.values.profileImage ? "Kaydet" : "Fotoğraf Seç"}
          </Text>
        </Pressable>
        <Pressable
          className="flex-1 items-center justify-center bg-funBlue rounded-md h-[50px]"
          onPress={handleClearImage}
        >
          <Text className="text-white text-[22px] font-medium">Temizle</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default UpdateProfileImageModalContent;
