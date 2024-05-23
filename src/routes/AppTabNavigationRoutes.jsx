import { View, Text } from "react-native";
import {  useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabButtonGroup from "../components/TabButtonGroup";
import Homepage from "../screens/Homepage";
import Settings from "../screens/Settings";
import MyProfile from "../screens/MyProfile";
import ContactForm from "../screens/ContactForm";
import MyProgress from "../screens/MyProgress";
import Statistics from "../screens/Statistics";
import CheckInternet from "../screens/CheckInternet";
import Loading from "../screens/Loading";
import { useNetInfo } from "@react-native-community/netinfo";
import useExecuteBackgroundTask from "../hooks/useExecuteBackgroundTask";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/authSlice";

function AppTabNavigatorRoutes({ navigation }) {
  const Stack = createNativeStackNavigator();
  const netInfoState = useNetInfo();

  const user = useSelector(selectUser);

  const {
    spendTimeInterval,
    commonNotificationInterval,
    socialMediaAddictionLevelTestReminderInterval,
  } = useSelector((state) => state.app);

  useExecuteBackgroundTask(
    user,
    spendTimeInterval,
    commonNotificationInterval,
    socialMediaAddictionLevelTestReminderInterval,
    navigation
  );

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

  const TestScreen = () => (<View><Text>{JSON.stringify(user)}</Text></View>)

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
          initialRouteName="Test"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Homepage" component={HomepageScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="MyProfile" component={MyProfile} />
          <Stack.Screen name="ContactForm" component={ContactForm} />
          <Stack.Screen name="MyProgress" component={MyProgressScreen} />
          <Stack.Screen name="Statistics" component={StatisticsScreen} />
        </Stack.Navigator>
      </View>
      <TabButtonGroup currentScreen={currentScreen} />
    </View>
  );
}

export default AppTabNavigatorRoutes;
