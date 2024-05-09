import { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import getTodayResultGraphJsCode from "../../../charts/scripts/TodayResultGraphJsCode";
import { selectUser } from "../../../redux/slices/authSlice";
import { useSelector } from "react-redux";
import ChartLoader from "../../../components/ChartLoader";
import { useNavigation } from "@react-navigation/native";
import { currentTime, startOfTheDay } from "../../../utils/timeUtils";
import UsageStatsService from "../../../services/usageStatsService";
import { ERROR_DURING_FETCHING_SOCIAL_MEDIA_APPLICATIONS_USAGE_DETAIL } from "../../../constants/messages";
import Loading from "../Loading";
import Error from "../Error";

function TodayTotalSpendTimeResultGraph() {
  const user = useSelector(selectUser);

  const navigation = useNavigation();

  const usageStatsService = new UsageStatsService();

  const [fetchResult, setFetchResult] = useState({
    loading: true,
    error: null,
    data: null,
  });

  const getSpentTimeOfAllSocialMediaApplication = async () => {
    try {
      setFetchResult({
        loading: true,
        ...fetchResult,
      });

      const allSocialMediaApplicationUsages =
        await usageStatsService.getUsageStats(
          startOfTheDay.valueOf(),
          currentTime.valueOf()
        );

      setFetchResult({
        ...fetchResult,
        data: allSocialMediaApplicationUsages,
      });
    } catch (error) {
      console.log(error);
      if (error) {
        setFetchResult({
          ...fetchResult,
          error,
        });
      } else {
        setFetchResult({
          ...fetchResult,
          error: ERROR_DURING_FETCHING_SOCIAL_MEDIA_APPLICATIONS_USAGE_DETAIL,
        });
      }
    } finally {
      setFetchResult((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };

  const getTodayResultGraph = useCallback(() => {
    if (fetchResult.data === null) {
      return getTodayResultGraphJsCode(user.addictionLevel.dailyLimit, 0);
    }

    const totalSpentTimeOfSocialMediaApplications =
    usageStatsService.getTotalSpentTimeOfSocialMediaApplications(fetchResult.data);

    const totalSpentTimeOfSocialMediaApplicationsAsMinutes = Math.floor(
      totalSpentTimeOfSocialMediaApplications / 60
    );

    const calculatedTotalSpentTimeOfSocialMediaApplicationsAsMinutes =
      totalSpentTimeOfSocialMediaApplicationsAsMinutes >
      user.addictionLevel.dailyLimit
        ? user.addictionLevel.dailyLimit
        : totalSpentTimeOfSocialMediaApplicationsAsMinutes;

    return getTodayResultGraphJsCode(
      user.addictionLevel.dailyLimit,
      calculatedTotalSpentTimeOfSocialMediaApplicationsAsMinutes
    );
  }, [fetchResult]);

  useEffect(() => {
    getSpentTimeOfAllSocialMediaApplication();
  }, []);

  const Header = () => {
    return (
      <View className="flex-[1]">
        <Text className="text-white text-[18px] font-medium">
          Bugünün Sonuçları
        </Text>
      </View>
    );
  };

  const Graph = () => {
    return (
      <View className="flex-[7]">
        <ChartLoader
          customClassName="flex-1"
          chartJsCode={getTodayResultGraph()}
        />
      </View>
    );
  };

  const GraphDetail = () => {
    return (
      <View className="flex-[1.5] flex-row justify-between">
        <View className="flex-[1] flex-col">
          <View className="flex flex-row gap-x-2 items-center">
            <View className="w-[15] h-[15] rounded-full bg-[#0077B6]"></View>
            <Text className="text-white">Kullanılan</Text>
          </View>
          <View className="flex flex-row gap-x-2 items-center">
            <View className="w-[15] h-[15] rounded-full bg-[#EDF7F6]"></View>
            <Text className="text-white">Kalan</Text>
          </View>
        </View>
        <View className="flex-[1] items-end justify-center">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Statistics", {
                selectedDate: new Date().toDateString(),
              })
            }
          >
            <Text className="underline text-saffronMango">Detayı Göster</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1">
      {fetchResult.loading ? <Loading /> : null}
      {!fetchResult.loading && fetchResult.error ? (
        <Error errorMessage={fetchResult.error} />
      ) : null}
      {!fetchResult.loading && !fetchResult.error ? (
        <View className="flex-1">
          <Header />
          <Graph />
          <GraphDetail />
        </View>
      ) : null}
    </View>
  );
}

export default TodayTotalSpendTimeResultGraph;
