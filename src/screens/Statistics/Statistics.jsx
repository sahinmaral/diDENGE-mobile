import { useMemo, useState } from "react";
import Container from "../../components/Container/Container";
import GoBackButton from "../../components/GoBackButton";
import WebView from "react-native-webview";
import dailyResultGraph from "../../charts/dailyResult/index.html";
import { View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

function Statistics() {
  const navigation = useNavigation();
  const route = useRoute();

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

  return (
    <Container customClasses="p-4">
      <GoBackButton
        navigation={navigation}
        header={`İstatistikler (${selectedDateStringified})`}
      />
      <View className="flex-[5]">
        <WebView source={dailyResultGraph} />
      </View>
      <View className="flex-[3]"></View>
    </Container>
  );
}

export default Statistics;
