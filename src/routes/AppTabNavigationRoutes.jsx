import { Text, View } from "react-native";
import { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabButtonGroup from "../components/TabButtonGroup";
import Settings from "../pages/Settings";
import Homepage from "../pages/Homepage";
import MyProfile from "../pages/MyProfile";
import MyProgress from "../pages/MyProgress";
import Statistics from "../pages/Statistics";
import { useNetInfo } from "@react-native-community/netinfo";
import CheckInternet from "../pages/CheckInternet";
import Loading from "../pages/Loading";

function AppTabNavigatorRoutes() {
  const Stack = createNativeStackNavigator();

  const netInfoState = useNetInfo();

  const [currentScreen, setCurrentScreen] = useState(null);

  const updateCurrentScreen = (selectedScreen) => {
    setCurrentScreen(selectedScreen);
  };

  const HomepageScreen = () => (
    <Homepage updateCurrentScreen={updateCurrentScreen} />
  );

  const SettingsScreen = () => (
    <Settings updateCurrentScreen={updateCurrentScreen} />
  );

  const MyProgressScreen = () => (
    <MyProgress updateCurrentScreen={updateCurrentScreen} />
  );

  const StatisticsScreen = () => (
    <Statistics updateCurrentScreen={updateCurrentScreen} />
  );

  if (netInfoState.type === "unknown") {
    return <Loading />;
  }

  if (!netInfoState.isConnected) {
    return <CheckInternet />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.92 }}>
        <Stack.Navigator
          initialRouteName="Homepage"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Homepage" component={HomepageScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="MyProfile" component={MyProfile} />
          <Stack.Screen name="MyProgress" component={MyProgressScreen} />
          <Stack.Screen name="Statistics" component={StatisticsScreen} />
        </Stack.Navigator>
      </View>
      <TabButtonGroup currentScreen={currentScreen} />
    </View>
  );
}

export default AppTabNavigatorRoutes;
