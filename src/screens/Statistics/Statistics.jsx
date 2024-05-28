import { useEffect, useMemo, useState } from "react";
import Container from "../../components/Container/Container";
import GoBackButton from "../../components/GoBackButton";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import DailyResultApplicationMenuItem from "./DailyResultApplicationMenuItem";
import getDailyResultPerApplicationGraphJsCode from "../../charts/scripts/DailyResultPerApplicationGraphJsCode";
import getDailyResultPerHourGraphJsCode from "../../charts/scripts/DailyResultPerHourGraphJsCode";
import ChartLoader from "../../components/ChartLoader";
import moment from "moment";
import socialMediaApplicationColors from "../../constants/socialMediaApplicationColors";
import UsageStatsService from "../../services/usageStatsService";
import apiService from "../../services/apiService";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";

function Statistics({ updateCurrentScreen }) {
  const navigation = useNavigation();
  const route = useRoute();

  const user = useSelector(selectUser);

  const usageStatsService = new UsageStatsService();

  const [selectedDate] = useState(new Date(route.params.selectedDate));

  const [fetchResult, setFetchResult] = useState({
    loading: true,
    error: null,
    data: {
      hourBased: [],
      applicatedBased: [],
    },
  });

  const startOfTheDayOfSelectedDate = useMemo(() => {
    return moment(selectedDate).startOf("day").toDate();
  }, [selectedDate]);

  const selectedDateStringified = useMemo(() => {
    if (selectedDate.toDateString() === new Date().toDateString()) {
      return "Bugün";
    } else {
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const year = selectedDate.getFullYear();

      return `${day}/${month}/${year}`;
    }
  }, [selectedDate]);

  const dailyResultPerHourGraphJsCode = useMemo(() => {
    return getDailyResultPerHourGraphJsCode(fetchResult.data.hourBased);
  }, [fetchResult]);

  const dailyResultPerApplicationGraphJsCode = useMemo(() => {
    const formattedDailyResultPerApplicationSeriesData =
      fetchResult.data.applicatedBased.map((result) => {
        return {
          name: result.name,
          data: [result.spentTime],
          color: result.color,
        };
      });

    return getDailyResultPerApplicationGraphJsCode(
      formattedDailyResultPerApplicationSeriesData
    );
  }, [fetchResult]);

  const getTotalSpentTimeOfAllSocialMediaApplicationsByEndTime = async (
    endTime
  ) => {
    const allSocialMediaApplicationUsages =
      await usageStatsService.getUsageStats(
        startOfTheDayOfSelectedDate.valueOf(),
        endTime.valueOf()
      );

    const totalSpentTimeOfSocialMediaApplications =
      usageStatsService.getTotalSpentTimeOfSocialMediaApplications(
        allSocialMediaApplicationUsages
      );

    const totalSpentTimeOfSocialMediaApplicationsAsMinutes = Math.floor(
      totalSpentTimeOfSocialMediaApplications / 60
    );

    return totalSpentTimeOfSocialMediaApplicationsAsMinutes;
  };

  const getSocialMediaApplicationUsagesAsApplication = async () => {
    const currentTime = moment();
    const selectedDateAsMoment = moment(selectedDate);

    const isSelectedDateAsMomentCurrentDate = selectedDateAsMoment.isSame(
      currentTime,
      "date"
    );

    if (isSelectedDateAsMomentCurrentDate) {
      const allSocialMediaApplicationUsages =
        await usageStatsService.getUsageStats(
          startOfTheDayOfSelectedDate.valueOf(),
          selectedDateAsMoment.add(1, "days").valueOf()
        );

      return Object.values(allSocialMediaApplicationUsages).map((stat) => {
        return {
          name: stat.appName,
          spentTime: stat.totalTimeInForeground,
          openingCount: stat.openCount,
          color: socialMediaApplicationColors[stat.packageName],
        };
      });
    } else {
      try {
        const nextDay = moment(selectedDate)
          .add(1, "days")
          .format("YYYY-MM-DD");
        const allSocialMediaApplicationUsagesResponse =
          await apiService.socialMediaApplicationUsages.fetchGetSocialMediaApplicationUsagesByStartAndEndTime(
            user.id,
            selectedDate,
            nextDay
          );

        return Object.values(
          allSocialMediaApplicationUsagesResponse.data[0]
        ).map((stat) => {
          return {
            name: stat.name,
            spentTime: stat.totalSpendTime,
            openingCount: stat.openingCount,
            color: socialMediaApplicationColors[stat.packageName],
          };
        });
      } catch (error) {
        throw error;
      }
    }
  };

  useEffect(() => {
    updateCurrentScreen("Statistics");

    if (selectedDate.toDateString() === new Date().toDateString()) {
      const hourBasedTasksForDefinedIntervals = [
        moment(selectedDate).hours(0).minutes(0),
        moment(selectedDate).hours(6).minutes(0),
        moment(selectedDate).hours(9).minutes(0),
        moment(selectedDate).hours(12).minutes(0),
        moment(selectedDate).hours(15).minutes(0),
        moment(selectedDate).hours(18).minutes(0),
        moment(selectedDate).hours(21).minutes(0),
        moment(selectedDate).hours(23).minutes(59),
      ].map(async (endTime) => {
        return await getTotalSpentTimeOfAllSocialMediaApplicationsByEndTime(
          endTime
        );
      });

      const allHourBasedTasksForDefinedIntervals = Promise.all(
        hourBasedTasksForDefinedIntervals
      );

      const applicationBasedTask =
        getSocialMediaApplicationUsagesAsApplication();

      Promise.all([allHourBasedTasksForDefinedIntervals, applicationBasedTask])
        .then((promiseResponse) => {
          const [
            allHourBasedTasksForDefinedIntervalsResponse,
            applicationBasedTaskResponse,
          ] = promiseResponse;

          setFetchResult((prevState) => ({
            ...prevState,
            data: {
              hourBased: allHourBasedTasksForDefinedIntervalsResponse,
              applicatedBased: applicationBasedTaskResponse,
            },
          }));
        })
        .catch((error) => {
          console.log(error);
          setFetchResult((prevState) => ({
            ...prevState,
            error:
              "Saat ve uygulama bazlı sosyal medya uygulama harcama sürelerini ve uygulama açılma sıklıklarını yüklerken hata oluştu. Lütfen tekrar deneyin.",
          }));
        })
        .finally(() => {
          setFetchResult((prevState) => ({
            ...prevState,
            loading: false,
          }));
        });
    } else {
      const applicationBasedTask =
        getSocialMediaApplicationUsagesAsApplication();

      Promise.all([applicationBasedTask])
        .then((promiseResponse) => {
          const [applicationBasedTaskResponse] = promiseResponse;

          setFetchResult((prevState) => ({
            ...prevState,
            data: {
              hourBased: null,
              applicatedBased: applicationBasedTaskResponse,
            },
          }));
        })
        .catch((error) => {
          console.log(error);
          setFetchResult((prevState) => ({
            ...prevState,
            error:
              "Saat ve uygulama bazlı sosyal medya uygulama harcama sürelerini ve uygulama açılma sıklıklarını yüklerken hata oluştu. Lütfen tekrar deneyin.",
          }));
        })
        .finally(() => {
          setFetchResult((prevState) => ({
            ...prevState,
            loading: false,
          }));
        });
    }
  }, []);

  return (
    <Container customClasses="p-4" scrollable={true}>
      <GoBackButton
        navigation={navigation}
        header={`İstatistikler (${selectedDateStringified})`}
      />
      {fetchResult.loading ? (
        <View className="h-[500] flex-[9] gap-[20] justify-center">
          <Text
            style={{
              fontSize: 15,
              fontWeight: "300",
              textAlign: "center",
              color: "white",
            }}
          >
            Saat ve uygulama bazlı sosyal medya uygulama harcama süreleri ve
            uygulama açılma sıklıkları yükleniyor
          </Text>
          <ActivityIndicator size="36" />
        </View>
      ) : null}
      {!fetchResult.loading && fetchResult.error ? (
        <View className="h-[500] flex-[9] gap-[20] justify-center">
          <Text
            style={{
              fontSize: 15,
              fontWeight: "300",
              textAlign: "center",
              color: "white",
            }}
          >
            {fetchResult.error}
          </Text>
        </View>
      ) : null}
      {!fetchResult.loading && !fetchResult.error ? (
        <ScrollView className="flex-[9]" nestedScrollEnabled={true}>
          {fetchResult.data.hourBased ? (
            <ChartLoader
              chartJsCode={dailyResultPerHourGraphJsCode}
              customClassName="h-[500]"
            />
          ) : null}

          {fetchResult.data.applicatedBased.length > 0 ? (
            <View className="h-[500]">
              <ChartLoader chartJsCode={dailyResultPerApplicationGraphJsCode} />

              <ScrollView nestedScrollEnabled={true} className="h-[100]">
                {fetchResult.data.applicatedBased.map((result) => {
                  return (
                    <DailyResultApplicationMenuItem
                      key={result.name}
                      name={result.name}
                      color={result.color}
                      spentTime={result.spentTime}
                      openingCount={result.openingCount}
                    />
                  );
                })}
              </ScrollView>
            </View>
          ) : null}
        </ScrollView>
      ) : null}
    </Container>
  );
}

export default Statistics;
