import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/pages/Login';
import Register from './src/pages/Register';
import SocialMediaAddictiveLevelIdentification from './src/pages/SocialMediaAddictiveLevelIdentification';
import ResultOfAddictiveLevel from './src/pages/ResultOfAddictiveLevel';
import Homepage from './src/pages/Homepage';
import { View } from 'react-native';
import TabButtonGroup from './src/components/TabButtonGroup';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();



function AppTabNavigatorRoutes() {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.92 }}>
        <Stack.Navigator initialRouteName="Homepage" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Homepage" component={Homepage} />
        </Stack.Navigator>
      </View>
      <TabButtonGroup />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar hidden={true} />
      <Stack.Navigator initialRouteName='SocialMediaAddictiveLevelIdentification' screenOptions={{ headerShown: false, }}>
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="App" component={AppTabNavigatorRoutes} />
        <Stack.Screen name="SocialMediaAddictiveLevelIdentification" component={SocialMediaAddictiveLevelIdentification} />
        <Stack.Screen name="ResultOfAddictiveLevel" component={ResultOfAddictiveLevel} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

