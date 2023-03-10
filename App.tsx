import React from "react";
import { AppDetail, Main, Settings } from "./screens";
import { NavigationContainer } from "@react-navigation/native";
import { useColorScheme, LogBox } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { MD3LightTheme, MD3DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProp } from "react-native-paper/lib/typescript/types";
import { createStackNavigator } from "@react-navigation/stack";
import * as Global from "./Global";
import * as Notifications from 'expo-notifications';


export default function App() {

  const Stack = createStackNavigator();

  LogBox.ignoreAllLogs();
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const isDarkTheme = useColorScheme() == 'dark';

  const theme: ThemeProp = {
    ...isDarkTheme ? MD3DarkTheme : MD3LightTheme,
    dark: isDarkTheme,
    roundness: 2,
    version: 3,
    colors: {
      ...isDarkTheme ? MD3DarkTheme.colors : MD3LightTheme.colors,
      primary: '#2196f3', //'#EC407A',
      secondary: '#9c27b0', //'#28C4ED',
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
