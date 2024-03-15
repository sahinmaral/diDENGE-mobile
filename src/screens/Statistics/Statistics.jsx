import { useEffect, useMemo, useState } from "react";
import Container from "../../components/Container/Container";
import GoBackButton from "../../components/GoBackButton";
import { ScrollView, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import DailyResultApplicationMenuItem from "./DailyResultApplicationMenuItem";
import getDailyResultPerApplicationGraphJsCode from "./DailyResultPerApplicationGraphJsCode";
import getDailyResultPerHourGraphJsCode from "./DailyResultPerHourGraphJsCode";
import ChartLoader from "../../components/ChartLoader";

function Statistics({ updateCurrentScreen }) {
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    updateCurrentScreen("Statistics");
  }, []);

  const [selectedDate] = useState(new Date(route.params.selectedDate));

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

  const exampleApplicationBasedResults = [
    { name: "Instagram", spentTime: 60, openingCount: 5, color: "#E4405F" },
    { name: "Facebook", spentTime: 20, openingCount: 5, color: "#3b5998" },
    { name: "Twitter", spentTime: 20, openingCount: 5, color: "#1DA1F2" },
    { name: "Youtube", spentTime: 20, openingCount: 5, color: "#FF0000" },
    { name: "Twitch", spentTime: 20, openingCount: 5, color: "#6441A5" },
  ];

  const exampleHourBasedResult = [0, 0, 30, 30, 60, 60, 60, 85];

  const formattedDailyResultPerApplicationSeriesData = useMemo(() => {
    return exampleApplicationBasedResults.map((result) => {
      return {
        name: result.name,
        data: [result.spentTime],
        color: result.color,
      };
    });
  }, [exampleApplicationBasedResults]);

  const dailyResultPerHourGraphJsCode = useMemo(() => {
    return getDailyResultPerHourGraphJsCode(exampleHourBasedResult);
  }, []);

  const dailyResultPerApplicationGraphJsCode = useMemo(() => {
    return getDailyResultPerApplicationGraphJsCode(
      formattedDailyResultPerApplicationSeriesData
    );
  }, []);

  return (
    <Container customClasses="p-4" scrollable={true}>
      <GoBackButton
        navigation={navigation}
        header={`İstatistikler (${selectedDateStringified})`}
      />
      <ScrollView className="flex-[9]" nestedScrollEnabled={true}>
        <ChartLoader
          chartJsCode={dailyResultPerHourGraphJsCode}
          customClassName="h-[500]"
        />

        <View className="h-[500]">
          <ChartLoader chartJsCode={dailyResultPerApplicationGraphJsCode} />

          <ScrollView nestedScrollEnabled={true} className="h-[100]">
            {exampleApplicationBasedResults.map((result) => {
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
      </ScrollView>
    </Container>
  );
}

export default Statistics;
