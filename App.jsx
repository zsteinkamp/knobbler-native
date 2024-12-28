import React from 'react';
import { AppContextProvider, useAppContext } from './AppContext'
import OscHandler, { sendOscMessage, sendMsgs } from './OscHandler';
import { Text, View } from 'react-native';
import Slider from '@react-native-community/slider'
import {
  createStaticNavigation,
} from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// TODO DELETEME

function SetupScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Setup Screen</Text>
    </View>
  );
}

function BluhandScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Bluhand Screen</Text>
    </View>
  );
}

function SendSliderValue(idx, val, oscData, setOscData) {
  const address = "/fader" + idx
  
  setOscData({
    ...oscData,
    [address]: val
  })
  sendOscMessage(address, [val])
  console.log("val: ", val, idx);
}

function KnobblerScreen() {
  const { oscData, setOscData } = useAppContext()

  const sliders = []
  for (let i = 1; i <= 8; i++) {
    sliders.push(
      <Slider
        key={i}
        style={{ width: 200, height: 40 }}
        value={oscData["/fader" + i]}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        onValueChange={(val) => { return SendSliderValue(i, val, oscData, setOscData) } }
        tapToSeek={true}
      />
    )
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Knobbler Screen</Text>
      <Button onPress={sendMsgs}>Send Messages</Button>
      <View style={{transform:[{rotate: "-90deg"}]}}>
        {sliders}
      </View>
    </View>
  );
}

const MyTabs = createBottomTabNavigator({
  screens: {
    Knobbler: KnobblerScreen,
    Bluhand: BluhandScreen,
    Setup: SetupScreen,
  }
})

const Navigation = createStaticNavigation(MyTabs);
// thank u https://thelinuxcode.com/react-context-for-beginners-the-complete-guide-2023/

export default function App() {
  return (
    <AppContextProvider>
      <OscHandler>
        <Navigation />
      </OscHandler>
    </AppContextProvider>
  )
}
