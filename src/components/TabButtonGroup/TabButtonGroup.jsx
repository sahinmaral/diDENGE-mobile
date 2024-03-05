import { Text, TouchableOpacity, View } from "react-native";
import { default as FeatherIcon } from "react-native-vector-icons/Feather";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

function TabButtonGroup({ currentScreen }) {
  const navigation = useNavigation();

  const handleTabPress = (screenName, params) => {
    if (params) navigation.navigate(screenName, { ...params });
    else navigation.navigate(screenName);
  };

  const renderTabBarIcons = (definedRoute) => {
    let iconName;
    let routeName;

    switch (definedRoute) {
      case "Homepage":
        iconName = "home";
        routeName = "Anasayfa";
        break;
      case "Settings":
        iconName = "settings";
        routeName = "Ayarlar";
        break;
      case "MyProgress":
        iconName = "calendar";
        routeName = "İlerlemeler";
        break;
      case "Statistics":
        iconName = "bar-chart";
        routeName = "İstatistikler";
        break;
      default:
        break;
    }

    return (
      <>
        <FeatherIcon name={iconName} color={"#2660A4"} size={24} />
        <Text
          className={`text-black ${
            currentScreen === definedRoute ? "font-bold" : "font-base"
          }`}
        >
          {routeName}
        </Text>
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
      <TouchableOpacity
        onPress={() =>
          handleTabPress("Statistics", {
            selectedDate: new Date().toDateString(),
          })
        }
        style={styles.button.container}
      >
        {renderTabBarIcons("Statistics")}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleTabPress("MyProgress")}
        style={styles.button.container}
      >
        {renderTabBarIcons("MyProgress")}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleTabPress("Settings")}
        style={styles.button.container}
      >
        {renderTabBarIcons("Settings")}
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
