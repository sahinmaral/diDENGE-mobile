import { View, Text } from "react-native";
import Container from "../../components/Container/Container";
import checkInternetAnimation from "../../../assets/no-internet-connection.json";
import LottieView from "lottie-react-native";

function CheckInternet() {
  return (
    <Container>
      <View className="flex-[3]">
        <LottieView
          style={{ flex: 1 }}
          source={checkInternetAnimation}
          autoPlay
          loop
        />
      </View>
      <View className="flex-[2] items-center">
        <Text className="text-2xl text-center text-white font-bold">
          İnternet bağlantısı yok
        </Text>
        <Text className="text-lg text-center text-white">
          Lütfen internet bağlantınızı kontrol ediniz.
        </Text>
      </View>
    </Container>
  );
}

export default CheckInternet;
