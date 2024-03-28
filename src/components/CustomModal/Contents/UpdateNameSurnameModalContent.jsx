import { Pressable, TextInput, View, Text, Animated } from "react-native";
import { useSelector } from "react-redux";
import { selectUser, setUser } from "../../../redux/slices/authSlice";
import { toggleModal } from "../../../redux/slices/modalSlice";
import { useFormik } from "formik";
import UpdateNameSurnameSchema from "../../../schemas/UpdateNameSurnameSchema";
import { useEffect } from "react";
import { useToast } from "react-native-toast-notifications";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import useSpinAnimation from "../../../hooks/useSpinAnimation";
import { fetchUpdateNameSurname } from "../../../services/APIService";
import { useDispatch } from "react-redux";

function UpdateNameSurnameModalContent() {
  const user = useSelector(selectUser);

  const dispatch = useDispatch();

  const spin = useSpinAnimation();

  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      firstName: user.firstName,
      lastName: user.lastName,
    },
    validationSchema: UpdateNameSurnameSchema,
    onSubmit: (values) => handleSubmit(values),
  });

  const setValuesAsCorrectFormat = (values) => {
    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const sendingValues = { lastName: values.lastName.toUpperCase() };

    const trimmedFullName = values.firstName.trim();
    const splittedAndTrimmedFullName = trimmedFullName.split(" ");
    if (splittedAndTrimmedFullName.length > 1) {
      const firstName = capitalize(splittedAndTrimmedFullName[0]);
      const middleName = capitalize(
        splittedAndTrimmedFullName.slice(1).join(" ")
      );
      sendingValues.firstName = firstName;
      sendingValues.middleName = middleName;
    } else {
      sendingValues.firstName = values.firstName;
    }

    return sendingValues;
  };

  const handleSubmit = (values) => {
    const sendingValues = setValuesAsCorrectFormat(values);

    fetchUpdateNameSurname(sendingValues, user.id, user.accessToken)
      .then(() => {
        dispatch(
          setUser({
            ...user,
            firstName: sendingValues.firstName,
            lastName: sendingValues.lastName,
            middleName: sendingValues.middleName,
          })
        );

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

  return (
    <View className="gap-y-2">
      <Text className="text-black font-medium text-xl justify-center py-2">
        Ad Soyad Bilgilerini Güncelle
      </Text>
      <TextInput
        className="text-[16px]  py-2 bg-gray-100 text-left px-3"
        placeholder="Adınız"
        onChangeText={formik.handleChange("firstName")}
        onBlur={formik.handleBlur("firstName")}
        value={formik.values.firstName}
      />
      <TextInput
        className="text-[16px]  py-2 bg-gray-100 text-left px-3"
        placeholder="Soyadınız"
        onChangeText={formik.handleChange("lastName")}
        onBlur={formik.handleBlur("lastName")}
        value={formik.values.lastName}
      />
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

export default UpdateNameSurnameModalContent;
