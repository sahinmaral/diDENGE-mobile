import React from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { selectWordOfTheDay } from "../../redux/slices/appSlice";

function WordOfTheDay() {
  const wordOfTheDay = useSelector(selectWordOfTheDay);

  return (
    <View>
      <Text className="text-white text-[18px] font-medium">Günün Sözü</Text>
      <Text className="text-white">{wordOfTheDay}</Text>
    </View>
  );
}

export default WordOfTheDay;
