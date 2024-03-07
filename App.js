import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import SocialMediaAddictiveLevelIdentification from './src/screens/SocialMediaAddictiveLevelIdentification';
import ResultOfAddictiveLevel from './src/screens/ResultOfAddictiveLevel';
import { StatusBar } from 'expo-status-bar';
import AppTabNavigatorRoutes from './src/routes/AppTabNavigationRoutes';

export default function App() {

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <StatusBar hidden={true} />
      <Stack.Navigator initialRouteName='App' screenOptions={{ headerShown: false, }}>
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="App" component={AppTabNavigatorRoutes} />
        <Stack.Screen name="SocialMediaAddictiveLevelIdentification" component={SocialMediaAddictiveLevelIdentification} />
        <Stack.Screen name="ResultOfAddictiveLevel" component={ResultOfAddictiveLevel} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

