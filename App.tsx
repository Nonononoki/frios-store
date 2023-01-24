import React from "react";
import { AppDetail, Main, Settings } from "./screens";
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from "@react-navigation/native";
import { useColorScheme } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { MD3LightTheme, MD3DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProp } from "react-native-paper/lib/typescript/types";
import { createStackNavigator } from "@react-navigation/stack";
import * as I18N from "./i18n";
import * as Global from "./Global";


export default function App() {

  const i18n = I18N.getI18n();
  const Stack = createStackNavigator();

  //SplashScreen.preventAutoHideAsync();
  //setTimeout(SplashScreen.hideAsync, 1000);

  const isDarkTheme = useColorScheme() == 'dark';
  console.log(useColorScheme())

  const theme : ThemeProp = {
    ...isDarkTheme ? MD3DarkTheme : MD3LightTheme,
    dark: isDarkTheme,
    roundness: 2,
    version: 3,
    colors: {
      ...isDarkTheme ? MD3DarkTheme.colors : MD3LightTheme.colors,
      primary: '#EC407A',
      secondary: '#28C4ED',
      tertiary: '#F2D3DD',
      background: isDarkTheme ? '#121212' : "#FFFFFF"
    },
  };

  const themeNavigation = {
    ...isDarkTheme ? DarkTheme : DefaultTheme,
    colors: {
      ...isDarkTheme ? DarkTheme.colors : DefaultTheme.colors,
    },
  };
  
  return (
    <PaperProvider theme={theme}>
      <StatusBar style={isDarkTheme ? "light" : "dark"} />
       <RootSiblingParent>
        <NavigationContainer theme={themeNavigation} ref={Global.navigationRef}>
          <Stack.Navigator>
            <Stack.Screen
              name="Main"
              options={{ headerShown: false, animationEnabled: false }}
              component={Main}
            ></Stack.Screen>
            <Stack.Screen
              name="Settings"
              options={{ headerShown: true, animationEnabled: false }}
              component={Settings}
            ></Stack.Screen>
            <Stack.Screen
              name="AppDetail"
              options={{ headerShown: false, animationEnabled: false }}
              component={AppDetail}
            ></Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </RootSiblingParent>
    </PaperProvider>
  );
}
