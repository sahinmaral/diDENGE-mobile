import { ActivityIndicator, FlatList, Text, View } from "react-native";
import getApplicationBasedResultGraphJsCode from "./ApplicationBasedResultGraphJsCode";
import { useEffect, useMemo, useState } from "react";
import ChartLoader from "../../../components/ChartLoader";
import SocialMediaDurationPicker from "./SocialMediaDurationPicker";
import MyProgressDetailScreenCategory from "../../../enums/MyProgressDetailScreenCategory";
import categoriesByDividedInterval from "../../../constants/categoriesByDividedInterval";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/slices/authSlice";
import apiService from "../../../services/apiService";
import socialMediaApplicationColors from "../../../constants/socialMediaApplicationColors";

function Details() {
  const user = useSelector(selectUser);

  const [fetchResult, setFetchResult] = useState({
    error: null,
    loading: true,
    data: [],
  });

  // const exampleResultData = [
  //   {
  //     name: "Instagram",
  //     data: [4000, 3000, 2000, 1000, 500, 250],
  //     color: {
  //       linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
  //       stops: [
  //         [0, "#405de6"],
  //         [1, "#833ab4"],
  //       ],
  //     },
  //   },
  //   {
  //     name: "Twitter",
  //     data: [3000, 2500, 2000, 1500, 1000, 0],
  //     color: {
  //       linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
  //       stops: [
  //         [0, "#1DA1F2"],
  //         [1, "#1877f2"],
  //       ],
  //     },
  //   },
  //   {
  //     name: "Facebook",
  //     data: [2000, 500, 250, 0, 0, 0],
  //     color: {
  //       linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
  //       stops: [
  //         [0, "#1877f2"],
  //         [1, "#3b5998"],
  //       ],
  //     },
  //   },
  //   {
  //     name: "Youtube",
  //     data: [5000, 4000, 3000, 2000, 1000, 1000],
  //     color: {
  //       linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
  //       stops: [
  //         [0, "#ff0000"],
  //         [1, "#ff4500"],
  //       ],
  //     },
  //   },
  // ];

  const [selectedDuration, setSelectedDuration] = useState(
    MyProgressDetailScreenCategory.OneWeek
  );

  const setStartTimeByDuration = () => {
    var currentDate = new Date();

    switch (selectedDuration) {
      case MyProgressDetailScreenCategory.OneWeek:
        return new Date(currentDate.setDate(currentDate.getDate() - 7));
      case MyProgressDetailScreenCategory.TwoWeeks:
        return new Date(currentDate.setDate(currentDate.getDate() - 14));
      case MyProgressDetailScreenCategory.OneMonths:
        return new Date(currentDate.setMonth(currentDate.getMonth() - 1));
      case MyProgressDetailScreenCategory.ThreeMonths:
        return new Date(currentDate.setMonth(currentDate.getMonth() - 3));
      default:
        return new Date(currentDate.setMonth(currentDate.getMonth() - 6));
    }
  };

  const handleSelectDuration = (duration) => {
    setSelectedDuration(duration);
  };

  const FlatListApplicationMenuItem = ({ result }) => {
    return (
      <View className="flex flex-row items-center justify-between my-2">
        <View className="flex flex-row items-center gap-5">
          <View
            className="w-[20] h-[20] border border-white"
            style={{ backgroundColor: result.color }}
          ></View>
          <Text className="text-white">{result.name}</Text>
        </View>
        <View>
          <Text className="text-white font-medium">{result.total} dakika</Text>
        </View>
      </View>
    );
  };

  const FlatListHeader = () => {
    return (
      <View className="flex flex-row items-center justify-between border-b border-b-white pb-4">
        <View className="flex-1 items-start">
          <Text className="text-white text-left">
            Sosyal Medya Uygulamaları
          </Text>
        </View>
        <View className="flex-1 items-end">
          <Text className="text-white text-right">
            Toplam Harcanan Süre (dakika)
          </Text>
        </View>
      </View>
    );
  };

  const groupedTotalTimeOfSocialMediaApplications = useMemo(() => {
    if (fetchResult.data.length === 0) return null;

    var totalSpentTimeOfSocialMediaApplications = fetchResult.data[0].map(
      (app) => {
        return {
          data: [],
          name: app.name,
          color: socialMediaApplicationColors[app.packageName],
        };
      }
    );

    // console.log(fetchResult.data);

    for (let i = 0; i < fetchResult.data.length; i++) {
      const totalUsagesOfDay = fetchResult.data[i];
      for (let k = 0; k < totalUsagesOfDay.length; k++) {
        const socialMediaApplicationUsage = totalUsagesOfDay[k];

        const foundOfAdded = totalSpentTimeOfSocialMediaApplications.find(
          (app) => app.name === socialMediaApplicationUsage.name
        );

        foundOfAdded.data[i] = Math.floor(
          socialMediaApplicationUsage.totalSpendTime / 60
        );
      }
    }

    return totalSpentTimeOfSocialMediaApplications;
  }, [fetchResult]);

  const applicationBasedResultGraphJsCode = useMemo(() => {
    return getApplicationBasedResultGraphJsCode(
      categoriesByDividedInterval[selectedDuration],
      groupedTotalTimeOfSocialMediaApplications
    );
  }, [selectedDuration, fetchResult]);

  const flatListMappedData = useMemo(() => {
    if (groupedTotalTimeOfSocialMediaApplications === null) return null;
    return groupedTotalTimeOfSocialMediaApplications.map((result) => {
      return {
        name: result.name,
        total: result.data.reduce((prev, curr) => prev + curr),
        color: result.color,
      };
    });
  }, [fetchResult]);

  const getSocialMediaApplicationUsagesByStartTime = (startTime) => {
    apiService.socialMediaApplicationUsages
      .fetchGetSocialMediaApplicationUsagesByStartTime(user.id, startTime)
      .then((response) => {
        setFetchResult({
          ...fetchResult,
          data: [...response.data],
        });

        if (response.data.every((element) => element.length === 0)) {
          throw "Seçtiğiniz tarihe ait herhangi bir sosyal medya uygulama kullanım detayı bulunamadı";
        }
      })
      .catch((error) => {
        if (error) {
          setFetchResult({
            ...fetchResult,
            error,
          });
        } else {
          setFetchResult({
            ...fetchResult,
            error:
              "Sosyal medya uygulama kullanım detaylarını görüntülenirken hata oluştu. Lütfen tekrar deneyiniz",
          });
        }
      })
      .finally(() => {
        setFetchResult((prevState) => ({
          ...prevState,
          loading: false,
        }));
      });
  };

  useEffect(() => {
    const startTime = setStartTimeByDuration(selectedDuration);
    getSocialMediaApplicationUsagesByStartTime(startTime);
  }, [selectedDuration]);

  return (
    <View className="flex-1">
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
        <View className="flex-[12.5]">
          <FlatList
            className="flex-[3.5]"
            data={flatListMappedData}
            ListHeaderComponent={FlatListHeader}
            renderItem={({ item }) => (
              <FlatListApplicationMenuItem result={item} />
            )}
            keyExtractor={(item) => item.name}
          />
          <View className="flex-[9]">
            <ChartLoader
              customClassName="flex-1"
              chartJsCode={applicationBasedResultGraphJsCode}
            />
          </View>
        </View>
      ) : null}
      {/* {!fetchResult.loading && !fetchResult.error ? <View>
          <Text>{JSON.stringify(groupedTotalTimeOfSocialMediaApplications)}</Text>
      </View> : null} */}
      <View className="flex-[1] flex-row justify-center items-center mt-1">
        <SocialMediaDurationPicker
          selected={selectedDuration}
          onPress={() =>
            handleSelectDuration(MyProgressDetailScreenCategory.OneWeek)
          }
          duration={MyProgressDetailScreenCategory.OneWeek}
        />
        <SocialMediaDurationPicker
          selected={selectedDuration}
          onPress={() =>
            handleSelectDuration(MyProgressDetailScreenCategory.TwoWeeks)
          }
          duration={MyProgressDetailScreenCategory.TwoWeeks}
        />
        <SocialMediaDurationPicker
          selected={selectedDuration}
          onPress={() =>
            handleSelectDuration(MyProgressDetailScreenCategory.OneMonths)
          }
          duration={MyProgressDetailScreenCategory.OneMonths}
        />
        <SocialMediaDurationPicker
          selected={selectedDuration}
          onPress={() =>
            handleSelectDuration(MyProgressDetailScreenCategory.ThreeMonths)
          }
          duration={MyProgressDetailScreenCategory.ThreeMonths}
        />
        <SocialMediaDurationPicker
          selected={selectedDuration}
          onPress={() =>
            handleSelectDuration(MyProgressDetailScreenCategory.SixMonths)
          }
          duration={MyProgressDetailScreenCategory.SixMonths}
        />
      </View>
    </View>
  );
}

export default Details;
