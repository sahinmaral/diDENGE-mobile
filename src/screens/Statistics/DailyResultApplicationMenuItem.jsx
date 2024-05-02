import { useMemo } from "react";
import { Text, View } from "react-native";

function DailyResultApplicationMenuItem({
  name,
  spentTime,
  openingCount,
  color,
}) {

  const formattedSpentTime = useMemo(() => {
    return spentTime >= 60 ? `${Math.floor(spentTime / 60)} dk` : `${spentTime} sn`
  },[spentTime])

  return (
    <View className="h-[50] flex-row justify-between items-center my-2">
      <View className="flex-[5] flex-row items-center gap-5">
        <View
          className="h-[60] w-[10] rounded-md"
          style={{ backgroundColor: color }}
        ></View>
        <Text className="text-white">{name}</Text>
      </View>

      <View className="flex-[3]">
        <View className="flex-row justify-between">
          <Text className="text-white">HS : </Text>
          <Text className="text-white">{formattedSpentTime}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-white">AS : </Text>
          <Text className="text-white">{openingCount} kez</Text>
        </View>
      </View>
    </View>
  );
}

export default DailyResultApplicationMenuItem;
