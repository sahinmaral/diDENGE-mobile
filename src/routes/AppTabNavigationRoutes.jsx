import { View } from "react-native";
import { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Settings from "../pages/Settings";
import Homepage from "../pages/Homepage";
import TabButtonGroup from "../components/TabButtonGroup";

function AppTabNavigatorRoutes() {
  const Stack = createNativeStackNavigator();

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

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.92 }}>
        <Stack.Navigator
          initialRouteName="Settings"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Homepage" component={HomepageScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </View>
      <TabButtonGroup currentScreen={currentScreen} />
    </View>
  );
}

export default AppTabNavigatorRoutes;
