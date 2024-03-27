import Container from "../../components/Container/Container";
import defaultUserImage from "../../../assets/default-user.png";
import { View, Text, Pressable, Image, NativeModules } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import getTodayResultGraphJsCode from "./TodayResultGraphJsCode";
import ChartLoader from "../../components/ChartLoader";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import moment from "moment-timezone";
import { getTotalSpentTimeOfSocialMediaApplications } from "../../utils/UsageStatsParser";
import WordOfTheDay from "./WordOfTheDay";

const { UsageStats } = NativeModules;

function Homepage({ updateCurrentScreen }) {
  const user = useSelector(selectUser);

  const [totalSpentTime, setTotalSpentTime] = useState(46);

  useEffect(() => {
    updateCurrentScreen("Homepage");
    getSpentTimeOfAllSocialMediaApplication();
  }, []);

  const getSpentTimeOfAllSocialMediaApplication = async () => {
    const currentTime = moment.tz("Europe/Istanbul");

    const todayTime = currentTime.clone().startOf("day");

    const allStats = await UsageStats.getUsageStats(
      todayTime.valueOf(),
      currentTime.valueOf()
    );

    const totalSpentTime = getTotalSpentTimeOfSocialMediaApplications(allStats);
    const roundedTotalSpendTime = totalSpentTime % 60;
    setTotalSpentTime(roundedTotalSpendTime);
  };

  const getTodayResultGraph = useCallback(() => {
    return getTodayResultGraphJsCode(
      user.addictionLevel.dailyLimit,
      totalSpentTime
    );
  }, [totalSpentTime]);

  return (
    <Container customClasses="px-4">
      <View className="flex flex-row justify-between items-center my-2 flex-[2]">
        <View className="flex flex-row items-center space-x-4">
          <Image source={defaultUserImage} className="w-[60px] h-[60px]" />
          <View>
            <Text className="text-saffronMango">Hoşgeldin</Text>
            <Text className="text-white text-[18px] font-medium">
              Ebubekir Sıddık
            </Text>
          </View>
        </View>

        <View>
          <Pressable className="bg-saffronMango h-[60px] w-[60px] rounded-full items-center justify-center">
            <FontAwesomeIcon icon={faMagnifyingGlass} size={24} color="black" />
          </Pressable>
        </View>
      </View>

      <View className="my-2 space-y-2 flex-[3]">
        <View>
          <Text className="text-white text-[18px] font-medium">Özet</Text>
          <Text className="text-white">
            Kullanıcının haftalık ne kadar vakit geçirdiği ve sıklıkla hangi
            uygulamada vakit geçirdiğine dair özet bilgi
          </Text>
        </View>
        <View className="items-end">
          <Text className="underline text-saffronMango">Detay göster</Text>
        </View>
      </View>

      <WordOfTheDay />

      <View className="my-2 space-y-2 flex-[1]">
        <View>
          <Text className="text-white text-[18px] font-medium">Odak Mod</Text>
          <View className="flex flex-row justify-between">
            <Text className="text-white">2 saat 32 dakika kaldı</Text>
            <Text className="underline text-saffronMango">
              Odak Modunu Kapat
            </Text>
          </View>
        </View>
      </View>

      <View className="space-y-2 my-2 flex-[9]">
        <View className="flex-[1]">
          <Text className="text-white text-[18px] font-medium">
            Bugünün Sonuçları
          </Text>
        </View>

        <View className="flex-[7]">
          <ChartLoader
            customClassName="flex-1"
            chartJsCode={getTodayResultGraph()}
          />
        </View>

        <View className="flex-[1] flex-row justify-between">
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
            <Text className="underline text-saffronMango">Detayı Göster</Text>
          </View>
        </View>
      </View>
    </Container>
  );
}

export default Homepage;
