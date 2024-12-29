import React from 'react';
import AppContextProvider from './AppContext'
import OscHandler from './OscHandler';
import { createStaticNavigation, DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import KnobblerScreen, { BluhandScreen, SetupScreen } from './KnobblerScreen'
import { useColorScheme } from 'react-native';

const MyTabs = createBottomTabNavigator({
  screens: {
    Knobbler: KnobblerScreen,
    Bluhand: BluhandScreen,
    Setup: SetupScreen,
  }
})

const Navigation = createStaticNavigation(MyTabs);
// thank u https://thelinuxcode.com/react-context-for-beginners-the-complete-guide-2023/
        //<Navigation theme={ theme === 'dark' ? DarkTheme : DefaultTheme } />

export default function App() {
  const theme = useColorScheme();
  console.log('THEME', theme)
  return (
    <AppContextProvider>
      <OscHandler>
        <Navigation theme={ DarkTheme } />
      </OscHandler>
    </AppContextProvider>
  )
}
