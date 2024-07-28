import React, { useState } from "react";
import { useEffect } from "react";
import { Text, View } from "react-native";
import apiService from "../../../services/apiService";
import { getCurrentTime } from "../../../utils/timeUtils";

function UserBrief({ navigation }) {
  const [fetchResult, setFetchResult] = useState({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    const handleFetch = async () => {
      try {
        const currentTime = getCurrentTime()
        const oneWeekBefore = currentTime.add(-1,"week")
        const socialMediaApplicationUsages = await apiService.socialMediaApplicationUsages.fetchGetSocialMediaApplicationUsagesByStartAndEndTime(oneWeekBefore, currentTime);
      } catch (error) {}
    };

    handleFetch();
  }, []);

  return (
    <View>
      <View>
        <Text className="text-white text-[18px] font-medium">Özet</Text>
        <Text className="text-white">
          Kullanıcının haftalık ne kadar vakit geçirdiği ve sıklıkla hangi
          uygulamada vakit geçirdiğine dair özet bilgi
        </Text>
      </View>
      <View
        className="items-end"
        onPress={() => navigation.navigate("MyProgress")}
      >
        <Text className="underline text-saffronMango">Detay göster</Text>
      </View>
    </View>
  );
}

export default UserBrief;
