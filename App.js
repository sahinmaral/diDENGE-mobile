import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./src/screens/Login";
import Register from "./src/screens/Register";
import SocialMediaAddictiveLevelIdentification from "./src/screens/SocialMediaAddictiveLevelIdentification";
import ResultOfAddictiveLevel from "./src/screens/ResultOfAddictiveLevel";
import AppTabNavigatorRoutes from "./src/routes/AppTabNavigationRoutes";
import { StatusBar } from "react-native";
import ContinueRegister from "./src/screens/Register/ContinueRegister";
import { ToastProvider } from "react-native-toast-notifications";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import CheckPermissionForNewUser from "./src/screens/CheckPermissionForNewUser/CheckPermissionForNewUser";
import ExplanationOfSocialMediaAddictiveLevelIdentification from "./src/screens/SocialMediaAddictiveLevelIdentification/ExplanationOfSocialMediaAddictiveLevelIdentification";
import { default as ModalNavigator } from "./src/components/CustomModal/Navigator";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <Provider store={store}>
      <ToastProvider>
        <NavigationContainer>
          <StatusBar hidden={true} />
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="App" component={AppTabNavigatorRoutes} />
            <Stack.Screen
              name="SocialMediaAddictiveLevelIdentification"
              component={SocialMediaAddictiveLevelIdentification}
            />
            <Stack.Screen
              name="ExplanationOfSocialMediaAddictiveLevelIdentification"
              component={ExplanationOfSocialMediaAddictiveLevelIdentification}
            />
            <Stack.Screen
              name="ContinueRegister"
              component={ContinueRegister}
            />
            <Stack.Screen
              name="CheckPermissionForNewUser"
              component={CheckPermissionForNewUser}
            />
            <Stack.Screen
              name="ResultOfAddictiveLevel"
              component={ResultOfAddictiveLevel}
            />
          </Stack.Navigator>
          <ModalNavigator />
        </NavigationContainer>
      </ToastProvider>
    </Provider>
  );
}
