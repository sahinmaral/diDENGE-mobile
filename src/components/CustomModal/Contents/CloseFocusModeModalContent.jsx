import React, { useState } from "react";
import { Pressable, View, Text } from "react-native";
import apiService from "../../../services/apiService";
import { selectUser, setUser } from "../../../redux/slices/authSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  ERROR_DURING_CLOSING_FOCUS_MODE,
  SUCCESSFULLY_CLOSED_FOCUS_MODE,
} from "../../../constants/messages";
import { toggleModal } from "../../../redux/slices/modalSlice";
import ToastService from "../../../services/toastService";
import { useToast } from "react-native-toast-notifications";
import LoadingSpin from "../../LoadingSpin/LoadingSpin";
import ToastOptions from "../../../classes/ToastOptions.js";
import ToastTypes from "../../../enums/ToastTypes.js";

function CloseFocusModeModalContent() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast()
  const toastService = new ToastService(toast);

  const handleCloseFocusMOde = async () => {
    try {
      setIsLoading(true);

      await apiService.users.fetchUpdateDoNotDisturbStatus(
        {
          isDoNotDisturbEnabled: false,
        },
        user.id,
        user.accessToken
      );

      dispatch(
        setUser({
          ...user,
          isDoNotDisturbEnabled: false,
        })
      );

      toastService.showToast(
        SUCCESSFULLY_CLOSED_FOCUS_MODE,
        new ToastOptions(ToastTypes.Success)
      );

      dispatch(toggleModal());
    } catch (error) {
      console.log(error);

      toastService.showToast(
        ERROR_DURING_CLOSING_FOCUS_MODE,
        new ToastOptions(ToastTypes.Danger)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="gap-y-2">
      <Text className="text-black font-medium text-xl justify-center py-2">
        Odak Mod
      </Text>
      <Text className="text-blue-400 font-normal text-lg justify-center py-2">
        Odak modu kapatmak istediğinize emin misiniz ?
      </Text>
      <View className="flex-row mt-8 w-full">
        <Pressable
          className="flex-1 flex-row items-center justify-center bg-saffronMango rounded-md h-[50px] mr-3"
          onPress={handleCloseFocusMOde}
        >
          <Text className="text-white text-[22px] font-medium">Evet</Text>
          {isLoading ? (
            <LoadingSpin spinStatus={isLoading} />
          ) : null}
        </Pressable>
        <Pressable
          className="flex-1 items-center justify-center bg-funBlue rounded-md h-[50px]"
          onPress={() => dispatch(toggleModal())}
        >
          <Text className="text-white text-[22px] font-medium">Hayır</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default CloseFocusModeModalContent;
