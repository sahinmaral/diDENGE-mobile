import Container from "../../components/Container/Container";
import defaultUserImage from "../../../assets/default-user.png";
import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { Entypo } from "@expo/vector-icons";
import WebView from "react-native-webview";
import todayResultGraph from "../../charts/todayResult/index.html";
import { useEffect } from "react";

function Homepage({ updateCurrentScreen }) {
  useEffect(() => {
    updateCurrentScreen("Homepage");
  }, []);

  return (
    <Container customClasses="px-4">
      <View className="flex flex-row justify-between items-center my-2 flex-[2]">
        <View className="flex flex-row items-center space-x-4">
          <Image
            source={defaultUserImage}
            className="w-[60px] h-[60px]"
            contentFit="fill"
          />
          <View>
            <Text className="text-saffronMango">Hoşgeldin</Text>
            <Text className="text-white text-[18px] font-medium">
              Ebubekir Sıddık
            </Text>
          </View>
        </View>

        <View>
          <Pressable className="bg-saffronMango h-[60px] w-[60px] rounded-full items-center justify-center">
            <Entypo name="magnifying-glass" size={24} color="black" />
          </Pressable>
        </View>
      </View>

      <View className="my-2 space-y-2 flex-[2]">
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

      <View className="my-2 flex-[1.5]">
        <View>
          <Text className="text-white text-[18px] font-medium">Günün Sözü</Text>
          <Text className="text-white">Günün Sözü</Text>
        </View>
      </View>

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

      <View className="space-y-2 my-2 flex-[8.5]">
        <View className="flex-[1]">
          <Text className="text-white text-[18px] font-medium">
            Bugünün Sonuçları
          </Text>
        </View>

        <View className="flex-[8]">
          <WebView source={todayResultGraph} />
        </View>

        <View className="flex-[1] items-end">
          <Text className="underline text-saffronMango">Detayı Göster</Text>
        </View>
      </View>
    </Container>
  );
}

export default Homepage;
