import { useCallback, useMemo, useState } from "react";
import { TouchableOpacity, View, Text, Pressable } from "react-native";
import { LocaleConfig, Calendar } from "react-native-calendars";
import { Feather } from "@expo/vector-icons";

LocaleConfig.locales["tr"] = {
  monthNames: [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ],
  monthNamesShort: [
    "Oca.",
    "Şub.",
    "Mar.",
    "Nis.",
    "May.",
    "Haz.",
    "Tem.",
    "Ağu.",
    "Eyl.",
    "Eki.",
    "Kas.",
    "Ara.",
  ],
  dayNames: [
    "Pazar",
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
  ],
  dayNamesShort: ["Paz.", "Pzt.", "Sal.", "Çar.", "Per.", "Cum.", "Cmt."],
};

LocaleConfig.defaultLocale = "tr";

const CalendarComponent = () => {
  const [currentMonth] = useState(new Date().getMonth() + 1);
  const [updatedMonth, setUpdatedMonth] = useState(new Date().getMonth() + 1);

  const renderCustomArrow = (direction) => {
    if (direction === "left") {
      return <Feather name="chevron-left" size={30} color="white" />;
    } else {
      if (currentMonth !== updatedMonth) {
        return <Feather name="chevron-right" size={30} color="white" />;
      } else {
        return <View className="h-[30] w-[30]"></View>;
      }
    }
  };

  const onDayPress = (date) => {
    console.log(date);
  };

  const onMonthChange = (date) => {
    if (date.month > currentMonth) {
      return;
    } else {
      setUpdatedMonth(date.month);
    }
  };

  return (
    <Calendar
      onDayPress={onDayPress}
      hideExtraDays={true}
      renderArrow={renderCustomArrow}
      onMonthChange={onMonthChange}
      disableArrowRight={currentMonth === updatedMonth}
      theme={{
        monthTextColor: "white",
        textMonthFontSize: 24,
        textMonthFontWeight: "bold",
        calendarBackground: "#2660A4",
        dayTextColor: "black",
        textDayFontWeight: "800",
        todayBackgroundColor: "#FFC857",
        todayTextColor: "white",
        "stylesheet.calendar.header": {
          dayTextAtIndex0: { color: "white" },
          dayTextAtIndex1: { color: "white" },
          dayTextAtIndex2: { color: "white" },
          dayTextAtIndex3: { color: "white" },
          dayTextAtIndex4: { color: "white" },
          dayTextAtIndex5: { color: "white" },
          dayTextAtIndex6: { color: "white" },
        },
      }}
    />
  );
};

export default CalendarComponent;
