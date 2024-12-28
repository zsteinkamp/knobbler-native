import React, { useEffect, createContext, useContext, useState } from 'react';
import { NativeEventEmitter, Text, View } from 'react-native';
import Slider from '@react-native-community/slider'
import {
  createStaticNavigation,
} from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import osc from 'expo-osc';

const portOut = 2347;
const portIn = 2346;
const address = "10.1.2.16";

// TODO DELETEME
function sendMsgs() {
  osc.sendMessage("/address/", ["foobar", 0.5]);
  osc.sendMessage("/address/", ["string value", 1, false, 0.5]);
}

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
  osc.sendMessage(address, [val])
  console.log("val: ", val, idx);
}

function KnobblerScreen() {
  const { oscData, setOscData } = useContext(AppContext)

  const sliders = []
  for (let i = 1; i <= 8; i++) {
    sliders.push(
        <Slider
          key={i}
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
      {sliders}
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

function OscHandler({children}) {
  const { oscData, setOscData } = useContext(AppContext)

  useEffect(() => {
    osc.createClient(address, portOut);
    osc.createServer(portIn);

    // create an event emitter sending the native osc module as parameter 
    // thank u https://bobbyhadz.com/blog/react-functional-component-add-event-listener
    const eventEmitter = new NativeEventEmitter(osc);

    const handleMessage = (oscMessage, oscData, setOscData) => {
      setOscData({
        ...oscData,
        [oscMessage.address]: oscMessage.data[0]
      })
      console.log("zmessage: ", oscMessage);
    };
    const listener = eventEmitter.addListener('GotMessage', (oscMessage) => handleMessage(oscMessage, oscData, setOscData));

    return () => {
      listener.remove()
    }
  }, []);

  return (<>{children}</>)
}

const Navigation = createStaticNavigation(MyTabs);
const AppContext = createContext()
// thank u https://thelinuxcode.com/react-context-for-beginners-the-complete-guide-2023/

export default function App() {
  const [oscData, setOscData] = useState({})

  return (
    <AppContext.Provider value={{oscData, setOscData}}>
      <OscHandler>
        <Navigation />
      </OscHandler>
    </AppContext.Provider>
  )
}
