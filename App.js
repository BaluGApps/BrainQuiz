import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/Screens/SplashScreen';
import HomeScreen from './src/Screens/HomeScreen';
import Addition from './src/Sections/Addition';
import Substraction from './src/Sections/Substraction';
import Multiplication from './src/Sections/Multiplication';
import Division from './src/Sections/Division';
import PEMDAS from './src/Sections/PEMDAS';
import WordProblems from './src/Sections/WordProblems';
import SpeedMath from './src/Sections/SpeedMath';
import LogicPuzzles from './src/Sections/LogicPuzzles';
import NumberSeries from './src/Sections/NumberSeries';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#F8F9FA' },
          }}
        >
          <Stack.Screen 
            name="Splash" 
            component={SplashScreen}
            options={{ animationEnabled: false }}
          />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Addition" component={Addition} />
          <Stack.Screen name="Subtraction" component={Substraction} />
          <Stack.Screen name="Multiplication" component={Multiplication} />
          <Stack.Screen name="Division" component={Division} />
          <Stack.Screen name="PEMDAS" component={PEMDAS} />
          <Stack.Screen name="WordProblems" component={WordProblems} />
          <Stack.Screen name="NumberSeries" component={NumberSeries} />
          <Stack.Screen name="SpeedMath" component={SpeedMath} />
          <Stack.Screen name="LogicPuzzles" component={LogicPuzzles} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;