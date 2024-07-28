import {useState } from "react";
import { Pressable, View, Text } from "react-native";
import { selectUser, setUser } from "../../../redux/slices/authSlice";
import { useSelector } from "react-redux";
import DatePicker from "react-native-date-picker";
import ToastService from "../../../services/toastService";
import { useToast } from "react-native-toast-notifications";
import {
  FOCUS_MODE_EXPIRED_TIME_INVALID,
  ERROR_DURING_UPDATING_DONOTDISTURB_STATUS,
} from "../../../constants/messages/index.js";
import moment from "moment";
import ToastOptions from "../../../classes/ToastOptions.js";
import ToastTypes from "../../../enums/ToastTypes.js";
import {
  convertDateToISOFormatWithoutChangingTimezone,
  getAsTwoDigits,
  getCurrentTime,
  getStartOfTheDayTime,
} from "../../../utils/timeUtils.js";
import apiService from "../../../services/apiService/index.js";
import { useDispatch } from "react-redux";
import LoadingSpin from "../../LoadingSpin/LoadingSpin.jsx";
import { toggleModal } from "../../../redux/slices/modalSlice.js";

function SetFocusModeModalContent() {
  const user = useSelector(selectUser);
  const toast = useToast();
  const dispatch = useDispatch();

  const toastService = new ToastService(toast);

  const initialDatePickerProperties = {
    isVisible: false,
    selected: null,
  };

  const [datePickerProperties, setDatePickerProperties] = useState(
    initialDatePickerProperties
  );

  const [isLoading, setIsLoading] = useState(false);

  const toggleDatePicker = (isVisible) => {
    setDatePickerProperties((prevState) => ({
      ...prevState,
      isVisible
    }));
  };

  const setSelectedDate = (selectedDate) => {
    setDatePickerProperties({
      isVisible: false,
      selected: selectedDate,
    });
  };

  const clearDatePickerProperties = () => {
    setDatePickerProperties({ ...initialDatePickerProperties });
  };

  const handleUpdateDoNotDisturbMode = async () => {
    try {
      const doNotDisturbExpires = datePickerProperties.selected.toDate();

      setIsLoading(true);

      const stringifiedDate = convertDateToISOFormatWithoutChangingTimezone(doNotDisturbExpires)

      await apiService.users.fetchUpdateDoNotDisturbStatus(
        {
          isDoNotDisturbEnabled: true,
          doNotDisturbExpires: stringifiedDate,
        },
        user.id,
        user.accessToken
      );

      dispatch(
        setUser({
          ...user,
          isDoNotDisturbEnabled: true,
          doNotDisturbExpires: stringifiedDate,
        })
      );

      const differenceInMinutes = datePickerProperties.selected.diff(
        getCurrentTime().set("second", 0).set("millisecond", 0),
        "minutes"
      );
      const hours = Math.floor(differenceInMinutes / 60);
      const minutes = differenceInMinutes % 60;

      toastService.showToast(
        hours === 0
          ? `Odak modu aktif edildi. ${minutes} dakika sonra kapanacaktır.`
          : minutes === 0
          ? `Odak modu aktif edildi. ${hours} saat sonra kapanacaktır.`
          : `Odak modu aktif edildi. ${hours} saat ${minutes} dakika sonra kapanacaktır.`,
        new ToastOptions(ToastTypes.Success)
      );

      dispatch(toggleModal());

    } catch (error) {
      console.log(error);

      toastService.showToast(
        ERROR_DURING_UPDATING_DONOTDISTURB_STATUS,
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
        Odak mod sayesinde belirlediğiniz saat kadar sosyal medya
        uygulamalarından bildirim alamayacaksınız.{" "}
        <Text className="font-bold">Yarım saat</Text> ile{" "}
        <Text className="font-bold">12 saat</Text> arasında olmalıdır.
      </Text>
      {datePickerProperties.selected !== null ? (
        <View className="flex-row gap-2 justify-center">
          <View className="bg-gray-200 w-[100] h-[100] justify-center items-center rounded-md">
            <Text className="text-white font-bold text-[50px]">
              {getAsTwoDigits(datePickerProperties.selected.hour())}
            </Text>
          </View>
          <View className="bg-gray-200 w-[100] h-[100] justify-center items-center rounded-md">
            <Text className="text-white font-bold text-[50px]">
              {getAsTwoDigits(datePickerProperties.selected.minute())}
            </Text>
          </View>
        </View>
      ) : null}
      <View className="flex-row mt-8 w-full">
        <Pressable
          className="flex-1 flex-row items-center justify-center bg-saffronMango rounded-md h-[50px] mr-3"
          onPress={async () => {
            if (datePickerProperties.selected === null) {
              toggleDatePicker(true);
            } else {
              await handleUpdateDoNotDisturbMode();
            }
          }}
        >
          <Text className="text-white text-[22px] font-medium">
            {datePickerProperties.selected === null ? "Zamanı Seç" : "Uygula"}
          </Text>
          {isLoading ? <LoadingSpin spinStatus={isLoading} /> : null}
        </Pressable>
        <Pressable
          className="flex-1 items-center justify-center bg-funBlue rounded-md h-[50px]"
          onPress={() => {
            clearDatePickerProperties();
          }}
        >
          <Text className="text-white text-[22px] font-medium">Temizle</Text>
        </Pressable>
      </View>
      <DatePicker
        modal
        mode="time"
        date={getStartOfTheDayTime().toDate()}
        maximumDate={moment().hour(12).minute(0)}
        title="Odak modunun kapanacağı saati seçiniz"
        confirmText="Seç"
        cancelText="Kapat"
        open={datePickerProperties.isVisible}
        locale="tr"
        onConfirm={(time) => {
          const selectedTime = moment(time);

          if (selectedTime.diff(getStartOfTheDayTime(), "minute") < 30) {
            toastService.showToast(
              FOCUS_MODE_EXPIRED_TIME_INVALID,
              new ToastOptions(ToastTypes.Danger)
            );

            toggleDatePicker(false);
          } else {
            setSelectedDate(
              getCurrentTime()
                .add(selectedTime.hour(), "hour")
                .add(selectedTime.minute(), "minute")
                .set("second", 0)
            );
          }
        }}
        onCancel={() => toggleDatePicker(false)}
      />
    </View>
  );
}

export default SetFocusModeModalContent;
