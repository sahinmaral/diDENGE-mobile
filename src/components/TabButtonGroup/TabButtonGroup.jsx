import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { default as FeatherIcon } from "react-native-vector-icons/Feather";
import { StyleSheet } from "react-native";

function TabButtonGroup() {
  const navigation = useNavigation();

  const handleTabPress = (screenName) => {
    navigation.navigate(screenName);
  };

  const renderTabBarIcons = (route) => {
    let iconName;
    let routeName;

    switch (route) {
      case "Homepage":
        iconName = "home";
        routeName = "Anasayfa";
        break;
      default:
        break;
    }

    return (
      <>
        <FeatherIcon name={iconName} color={"#2660A4"} size={24} />
        <Text className="text-black">{routeName}</Text>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => handleTabPress("Homepage")}
        style={styles.button.container}
      >
        {renderTabBarIcons("Homepage")}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 0.08, flexDirection: "row" },
  button: {
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  },
});
export default TabButtonGroup;
