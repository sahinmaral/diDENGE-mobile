import { StyleSheet, Text, View, Image } from "react-native";
import Container from "../../components/Container/Container";
import noInternetConnectionImage from "../../../assets/no-internet-connection.jpg";

function CheckInternet() {
  return (
    <Container>
      <View className="flex-[2] items-center justify-center">
        <Image style={styles.image} source={noInternetConnectionImage} />
      </View>
      <View className="flex-[1] items-center">
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    borderRadius: 10,
    flex: 0.5,
    width: "60%",
    backgroundColor: "#0553",
  },
});

export default CheckInternet;
