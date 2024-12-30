import React from 'react';
import { Button } from 'react-native';
import AppContextProvider from './AppContext'
import OscHandler from './OscHandler';
import { createStaticNavigation, DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import KnobblerScreen, { BluhandScreen, SetupScreen } from './KnobblerScreen'
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DEFAULT_COLOR } from './lib/constants';

const commonScreenOptions = {
  // placeholder
  headerLeft: () => <Button color={"#" + DEFAULT_COLOR} title="init" />
}

const MyTabs = createBottomTabNavigator({
  screens: {
    Knobbler: {
      screen: KnobblerScreen,
      options: {
        ...commonScreenOptions,
      },
      initialParams: { 
        page: 1
      }
    },
    Knobbler2: {
      screen: KnobblerScreen,
      options: {
        ...commonScreenOptions,
      },
      initialParams: { 
        page: 2
      }
    },
    Bluhand: {
      screen: BluhandScreen,
      options: {
        ...commonScreenOptions,
      }
    },
    Setup: SetupScreen,
  }
})

const Navigation = createStaticNavigation(MyTabs);

export default function App() {
  const theme = useColorScheme();
  return (
    <AppContextProvider>
      <OscHandler>
        <GestureHandlerRootView>
          <Navigation theme={ DarkTheme } />
        </GestureHandlerRootView>
      </OscHandler>
    </AppContextProvider>
  )
}
