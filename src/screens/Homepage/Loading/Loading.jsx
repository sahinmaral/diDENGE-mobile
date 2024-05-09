import { ActivityIndicator, Text, View } from "react-native";

function Loading() {
  return (
    <View className="flex-[9] justify-center items-center gap-5">
      <Text
        style={{
          fontSize: 15,
          fontWeight: "300",
          textAlign: "center",
          color: "white",
        }}
      >
        Sosyal medyada geçirdiğiniz toplam süre yükleniyor
      </Text>
      <ActivityIndicator size="36" />
    </View>
  );
}

export default Loading;
