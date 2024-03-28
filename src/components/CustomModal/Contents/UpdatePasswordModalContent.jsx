import React, { useEffect, useState } from "react";
import { Pressable, TextInput, View, Text, Animated } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import useSpinAnimation from "../../../hooks/useSpinAnimation";
import { useToast } from "react-native-toast-notifications";
import { useFormik } from "formik";
import UpdatePasswordSchema from "../../../schemas/UpdatePasswordSchema";
import { fetchUpdatePassword } from "../../../services/APIService";
import { selectUser, setUser } from "../../../redux/slices/authSlice";
import { toggleModal } from "../../../redux/slices/modalSlice";
import {
  faArrowsRotate,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import translatedErrorMessages from "../../../locale";

function UpdatePasswordModalContent() {
  const user = useSelector(selectUser);

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const spin = useSpinAnimation();

  const toast = useToast();

  const [securePassword, setSecurePassword] = useState({
    oldPassword: true,
    newPassword: true,
    newPasswordConfirm: true,
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: "Abc1234.",
      newPassword: "Abc1234?",
      newPasswordConfirm: "Abc1234?",
    },
    validationSchema: UpdatePasswordSchema,
    onSubmit: (values) => handleSubmit(values),
  });

  const handleSubmit = (values) => {
    const sendingValues = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    };

    fetchUpdatePassword(sendingValues, user.id, user.accessToken)
      .then(() => {
        toast.show(
          "İşlem başarılı. Yeni şifrenizle giriş yapmanız gerekecek.",
          {
            type: "success",
            placement: "top",
          }
        );

        setUser(null);

        navigation.navigate("Login");
      })
      .catch((error) => {
        if (error.response) {
          const { data } = error.response;

          toast.show(translatedErrorMessages[data.Detail], {
            type: "danger",
            placement: "top",
          });
        } else {
          toast.show(
            "Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
            {
              type: "danger",
              placement: "top",
            }
          );
        }
      })
      .finally(() => {
        dispatch(toggleModal());
      });
  };

  useEffect(() => {
    if (!formik.isValid && !formik.isValidating && formik.isSubmitting) {
      const errorWithStars = Object.values(formik.errors)
        .map((error) => `* ${error}`)
        .join("\n");

      toast.show(errorWithStars, {
        type: "warning",
        placement: "top",
      });
    }
  }, [formik]);

  const togglePasswordVisibility = (key) => {
    setSecurePassword({ ...securePassword, [key]: !securePassword[key] });
  };

  return (
    <View className="gap-y-4">
      <Text className="text-black font-medium text-xl justify-center py-2">
        Şifreni Güncelle
      </Text>
      <View>
        <TextInput
          className="text-[16px]  py-2 bg-gray-100 text-left px-3"
          placeholder="Mevcut Şifre"
          secureTextEntry={securePassword.oldPassword}
          onChangeText={formik.handleChange("oldPassword")}
          onBlur={formik.handleBlur("oldPassword")}
          value={formik.values.oldPassword}
        />
        <Pressable
          onPress={() => togglePasswordVisibility("oldPassword")}
          style={{ position: "absolute", top: 12, right: 8 }}
        >
          {securePassword.oldPassword ? (
            <FontAwesomeIcon icon={faEye} size={24} color="#FFC857" />
          ) : (
            <FontAwesomeIcon icon={faEyeSlash} size={24} color="#FFC857" />
          )}
        </Pressable>
      </View>

      <View>
        <TextInput
          className="text-[16px]  py-2 bg-gray-100 text-left px-3"
          placeholder="Yeni Şifre"
          secureTextEntry={securePassword.newPassword}
          onChangeText={formik.handleChange("newPassword")}
          onBlur={formik.handleBlur("newPassword")}
          value={formik.values.newPassword}
        />
        <Pressable
          onPress={() => togglePasswordVisibility("newPassword")}
          style={{ position: "absolute", top: 12, right: 8 }}
        >
          {securePassword.newPassword ? (
            <FontAwesomeIcon icon={faEye} size={24} color="#FFC857" />
          ) : (
            <FontAwesomeIcon icon={faEyeSlash} size={24} color="#FFC857" />
          )}
        </Pressable>
      </View>

      <View>
        <TextInput
          className="text-[16px]  py-2 bg-gray-100 text-left px-3"
          placeholder="Yeni Şifre Tekrarı"
          secureTextEntry={securePassword.newPasswordConfirm}
          onChangeText={formik.handleChange("newPasswordConfirm")}
          onBlur={formik.handleBlur("newPasswordConfirm")}
          value={formik.values.newPasswordConfirm}
        />
        <Pressable
          onPress={() => togglePasswordVisibility("newPasswordConfirm")}
          style={{ position: "absolute", top: 12, right: 8 }}
        >
          {securePassword.newPasswordConfirm ? (
            <FontAwesomeIcon icon={faEye} size={24} color="#FFC857" />
          ) : (
            <FontAwesomeIcon icon={faEyeSlash} size={24} color="#FFC857" />
          )}
        </Pressable>
      </View>

      <Pressable
        className="items-center justify-center bg-saffronMango rounded-md h-[50px]"
        onPress={formik.handleSubmit}
      >
        <View className="flex flex-row items-center gap-10">
          <Text className="text-white text-[22px] font-medium">Güncelle</Text>
          {formik.isSubmitting ? (
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <FontAwesomeIcon icon={faArrowsRotate} color="white" size={20} />
            </Animated.View>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
}

export default UpdatePasswordModalContent;
