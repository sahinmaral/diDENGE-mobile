import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import getApplicationBasedResultGraphJsCode from "./ApplicationBasedResultGraphJsCode";
import { useMemo } from "react";
import ChartLoader from "../../../components/ChartLoader";

function Details() {
  const exampleResultData = [
    {
      name: "Instagram",
      data: [4000, 3000, 2000, 1000, 500, 250],
      color: {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
          [0, "#405de6"],
          [1, "#833ab4"],
        ],
      },
    },
    {
      name: "Twitter",
      data: [3000, 2500, 2000, 1500, 1000, 0],
      color: {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
          [0, "#1DA1F2"],
          [1, "#1877f2"],
        ],
      },
    },
    {
      name: "Facebook",
      data: [2000, 500, 250, 0, 0, 0],
      color: {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
          [0, "#1877f2"],
          [1, "#3b5998"],
        ],
      },
    },
    {
      name: "Youtube",
      data: [5000, 4000, 3000, 2000, 1000, 1000],
      color: {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
          [0, "#ff0000"],
          [1, "#ff4500"],
        ],
      },
    },
  ];

  const exampleCategory = ["Ay 1", "Ay 2", "Ay 3", "Ay 4", "Ay 5", "Ay 6"];

  const applicationBasedResultGraphJsCode = useMemo(() => {
    return getApplicationBasedResultGraphJsCode(
      exampleCategory,
      exampleResultData
    );
  }, []);

  const FlatListApplicationMenuItem = ({ result }) => {
    return (
      <View className="flex flex-row items-center justify-between my-2">
        <View className="flex flex-row items-center gap-5">
          <View className="w-[20] h-[20] bg-red-100"></View>
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

  const flatListMappedData = useMemo(() => {
    return exampleResultData.map((result) => {
      return {
        name: result.name,
        total: result.data.reduce((prev, curr) => prev + curr),
      };
    });
  }, []);

  return (
    <View className="flex-1">
      <FlatList
        className="flex-[3.5]"
        data={flatListMappedData}
        ListHeaderComponent={FlatListHeader}
        renderItem={({ item }) => <FlatListApplicationMenuItem result={item} />}
        keyExtractor={(item) => item.name}
      />
      <View className="flex-[9]">
        <ChartLoader
          customClassName="flex-1"
          chartJsCode={applicationBasedResultGraphJsCode}
        />
      </View>
      <View className="flex-[1] flex-row justify-center gap-x-5 mt-1">
        <Pressable className="w-[50] h-[50] p-2 items-center justify-center rounded-full">
          <Text className="text-white">1 hft</Text>
        </Pressable>
        <Pressable className="w-[50] h-[50] p-2 items-center justify-center rounded-full">
          <Text className="text-white">2 hft</Text>
        </Pressable>
        <Pressable className="w-[50] h-[50] p-2 items-center justify-center rounded-full">
          <Text className="text-white">1 ay</Text>
        </Pressable>
        <Pressable className="w-[50] h-[50] p-2 items-center justify-center rounded-full">
          <Text className="text-white">3 ay</Text>
        </Pressable>
        <Pressable className="w-[50] h-[50] bg-[#FFC857] p-2 items-center justify-center rounded-full">
          <Text className="text-white">6 ay</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default Details;
