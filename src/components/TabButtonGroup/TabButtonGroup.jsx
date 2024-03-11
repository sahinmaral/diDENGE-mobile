import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChartSimple,
  faGear,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

function TabButtonGroup({ currentScreen }) {
  const navigation = useNavigation();

  const handleTabPress = (screenName, params) => {
    if (params) navigation.navigate(screenName, { ...params });
    else navigation.navigate(screenName);
  };

  const renderTabBarIcons = (definedRoute) => {
    let icon;
    let routeName;

    switch (definedRoute) {
      case "Homepage":
        icon = faHouse;
        routeName = "Anasayfa";
        break;
      case "Settings":
        icon = faGear;
        routeName = "Ayarlar";
        break;
      case "MyProgress":
        icon = faCalendar;
        routeName = "İlerlemeler";
        break;
      case "Statistics":
        icon = faChartSimple;
        routeName = "İstatistikler";
        break;
      default:
        break;
    }

    return (
      <>
        <FontAwesomeIcon icon={icon} color={"#2660A4"} size={24} />
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
