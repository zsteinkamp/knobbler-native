import React from 'react';
import { Button, Text } from 'react-native';
import AppContextProvider from './AppContext'
import OscHandler from './OscHandler';
import { createStaticNavigation, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import KnobblerScreen from './KnobblerScreen'
import BluhandScreen from './BluhandScreen'
import SetupScreen from './SetupScreen'
import ControlScreen from './ControlScreen'
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DEFAULT_COLOR } from './lib/constants';

const commonScreenOptions = {
  // placeholder
  headerLeft: () => <Button color={"#" + DEFAULT_COLOR} title="Unmap" />
}

const TITLES = {
  knobbler1: { title: "Knobbler 1", emoji: "☝" },
  knobbler2: { title: "Knobbler 2", emoji: "✌" },
  bluhand: { title: "Bluhand", emoji: "✋" },
  control: { title: "Control", emoji: "🎧️" },
  setup: { title: "Setup", emoji: "⚙️" },
}

const titleOptions = (key) => {
  const meta = TITLES[key]
  return {
    ...commonScreenOptions,
    title: meta.title,
    headerTitle: meta.emoji + " " + meta.title,
    tabBarIcon: () => { return <Text>{meta.emoji}</Text> },
  }
}

const MyTabs = createBottomTabNavigator({
  screens: {
    Knobbler: {
      screen: KnobblerScreen,
      options: titleOptions('knobbler1'),
      initialParams: { 
        page: 1
      }
    },
    Knobbler2: {
      screen: KnobblerScreen,
      options: titleOptions('knobbler2'),
      initialParams: { 
        page: 2
      }
    },
    Bluhand: {
      screen: BluhandScreen,
      options: titleOptions('bluhand'),
    },
    /*Control: {
      screen: ControlScreen,
      options: titleOptions('control'),
    },*/
    Setup: {
      screen: SetupScreen,
      options: titleOptions('setup'),
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
