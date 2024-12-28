import React from "react";
import { useAppContext } from "./AppContext";
import { sendMsgs, sendOscMessage } from "./OscHandler";
import { DimensionValue, Text, View } from 'react-native';
import Slider from "@react-native-community/slider";

function SendSliderValue(idx, val, oscData, setOscData) {
  const address = "/val" + idx

  setOscData({
    ...oscData,
    [address]: val
  })
  sendOscMessage(address, [val])
  console.log("val: ", val, idx);
}

function KnobblerScreen() {
  const { oscData, setOscData } = useAppContext()

  const rows = 2
  const cols = 8

  const sliders = []
  for (let row = 0; row < rows; row++) {
    const topPct = (20 + (80 / rows) * row) + "%"
    for (let col = 0; col < cols; col++) {
      const leftPct = (5 + ((90 / cols) * col)) + "%"
      const idx = 1 + (col + (cols * (row)))
      const trackColor = "#" + ((oscData["/val" + idx + "color"]) || "fc3")
      sliders.push(
        <View
          key={idx}
          style={{ position: "absolute", top: topPct as DimensionValue, left: leftPct as DimensionValue }}
        >
          <Text style={{ position: "relative", top: -80, left: 0, textAlign: "center", width: 196 }}>{oscData["/valStr" + idx]}</Text>
          <View
            key={idx}
            style={{ transform: [{ rotate: "-90deg" }] }}
          >
            <Slider
              style={{ width: 200 }}
              value={oscData["/val" + idx]}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor={trackColor}
              maximumTrackTintColor="#000000"
              thumbTintColor={trackColor}
              onValueChange={(val) => { return SendSliderValue(idx, val, oscData, setOscData) }}
              tapToSeek={true}
            />
          </View>
          <Text style={{ position: "relative", top: 90, left: 0, textAlign: "center", width: 196 }}>
            {oscData["/param" + idx]}
          </Text>
          <Text style={{ position: "relative", top: 100, left: 0, textAlign: "center", width: 196 }}>
            {oscData["/device" + idx]}
          </Text>
          <Text style={{ position: "relative", top: 110, left: 0, textAlign: "center", width: 196 }}>
            {oscData["/track" + idx]}
          </Text>
        </View>
      )
    }
  }

  console.log("OSC DATA", JSON.stringify(oscData))

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {sliders}
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