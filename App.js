import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/pages/Login';
import Register from './src/pages/Register';
import SocialMediaAddictiveLevelIdentification from './src/pages/SocialMediaAddictiveLevelIdentification';
import ResultOfAddictiveLevel from './src/pages/ResultOfAddictiveLevel';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ResultOfAddictiveLevel" component={ResultOfAddictiveLevel} />
        <Stack.Screen name="SocialMediaAddictiveLevelIdentification" component={SocialMediaAddictiveLevelIdentification} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

