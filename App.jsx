import React from 'react';
import { Button, Text } from 'react-native';
import AppContextProvider from './AppContext'
import OscHandler from './OscHandler';
import { createStaticNavigation, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import KnobblerScreen from './KnobblerScreen'
import BluhandScreen from './BluhandScreen'
import SetupScreen from './SetupScreen'
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DEFAULT_COLOR } from './lib/constants';

const commonScreenOptions = {
  // placeholder
  headerLeft: () => <Button color={"#" + DEFAULT_COLOR} title="Unmap" />
}

const MyTabs = createBottomTabNavigator({
  screens: {
    Setup: {
      screen: SetupScreen,
      options: {
        title: "Setup",
        tabBarIcon: () => { return <Text>⚙️</Text> },
      },
    },
    Knobbler: {
      screen: KnobblerScreen,
      options: {
        ...commonScreenOptions,
        title: "️Knobbler",
        tabBarIcon: () => { return <Text>☝</Text> },
      },
      initialParams: { 
        page: 1
      }
    },
    Knobbler2: {
      screen: KnobblerScreen,
      options: {
        ...commonScreenOptions,
        title: "Knobbler",
        tabBarIcon: () => { return <Text>✌</Text> },
      },
      initialParams: { 
        page: 2
      }
    },
    Bluhand: {
      screen: BluhandScreen,
      options: {
        ...commonScreenOptions,
        title: "Bluhand",
        tabBarIcon: () => { return <Text>✋</Text> },
      }
    },
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
