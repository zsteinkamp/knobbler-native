import React from "react";
import { useAppContext } from "./AppContext";
import { sendMsgs, sendOscMessage } from "./OscHandler";
import { Text, View } from 'react-native';
import Slider from "@react-native-community/slider";
import { Button } from '@react-navigation/elements';

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
        style={{ width: 200 }}
        value={oscData["/fader" + i]}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        thumbTintColor="#fc3"
        onValueChange={(val) => { return SendSliderValue(i, val, oscData, setOscData) }}
        tapToSeek={true}
      />
    )
  }

  //    <View style={{ transform: [{ rotate: "-90deg" }] }}>

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Knobbler Screen</Text>
      <Button onPress={sendMsgs}>Send Messages</Button>
      <View style={{ transform: [{ rotate: "-90deg" }] }}>
        {sliders}
      </View>
    </View>
  );
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

export default KnobblerScreen
export { SetupScreen, BluhandScreen }