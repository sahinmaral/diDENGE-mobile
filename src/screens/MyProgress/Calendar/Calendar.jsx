import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState } from "react";
import { View } from "react-native";
import { Calendar } from "react-native-calendars";
import { setCalendarLocale } from "../../../constants/calendarLocale";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/slices/authSlice";
import moment from "moment";

const CalendarComponent = ({ navigation }) => {
  const user = useSelector(selectUser);

  const [currentMonth] = useState(new Date().getMonth() + 1);
  const [updatedMonth, setUpdatedMonth] = useState(new Date().getMonth() + 1);

  setCalendarLocale();

  const renderCustomArrow = (direction) => {
    if (direction === "left") {
      if (updatedMonth !== moment(user.createdAt).month() + 1) {
        return <FontAwesomeIcon icon={faChevronLeft} size={30} color="white" />;
      } else {
        return <View className="h-[30] w-[30]"></View>;
      }
    } else {
      if (
        currentMonth !== updatedMonth &&
        currentMonth !== moment(user.createdAt).month() + 1
      ) {
        return (
          <FontAwesomeIcon icon={faChevronRight} size={30} color="white" />
        );
      } else {
        return <View className="h-[30] w-[30]"></View>;
      }
    }
  };

  const onDayPress = (date) => {
    const selectedDate = new Date(date.dateString).toDateString();
    navigation.navigate("Statistics", { selectedDate });
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
      minDate={user.createdAt}
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
        textDisabledColor: "#A9A9A9",
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
