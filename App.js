import { NavigationContainer } from "@react-navigation/native";
import { default as ModalNavigator } from "./src/components/CustomModal/Navigator";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ToastProvider } from "react-native-toast-notifications";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { StatusBar } from "react-native";
import Login from "./src/screens/Login";
import Register from "./src/screens/Register";
import SocialMediaAddictiveLevelIdentification from "./src/screens/SocialMediaAddictiveLevelIdentification";
import ExplanationOfSocialMediaAddictiveLevelIdentification from "./src/screens/SocialMediaAddictiveLevelIdentification/ExplanationOfSocialMediaAddictiveLevelIdentification";
import CheckPermissionForNewUser from "./src/screens/CheckPermissionForNewUser";
import ResultOfAddictiveLevel from "./src/screens/ResultOfAddictiveLevel";
import AppTabNavigatorRoutes from "./src/routes/AppTabNavigationRoutes";
import ContinueRegister from "./src/screens/Register/ContinueRegister";
import LoggedOut from './src/screens/LoggedOut'

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
            <Stack.Screen name="LoggedOut" component={LoggedOut} />
            <Stack.Screen
              name="SocialMediaAddictiveLevelIdentification"
              component={SocialMediaAddictiveLevelIdentification}
            />
            <Stack.Screen
              name="ExplanationOfSocialMediaAddictiveLevelIdentification"
              component={ExplanationOfSocialMediaAddictiveLevelIdentification}
            />
            <Stack.Screen
              name="CheckPermissionForNewUser"
              component={CheckPermissionForNewUser}
            />
            <Stack.Screen
              name="ResultOfAddictiveLevel"
              component={ResultOfAddictiveLevel}
            />
            <Stack.Screen name="App" component={AppTabNavigatorRoutes} />
            <Stack.Screen
              name="ContinueRegister"
              component={ContinueRegister}
            />
          </Stack.Navigator>
          <ModalNavigator />
        </NavigationContainer>
      </ToastProvider>
    </Provider>
  );
}
