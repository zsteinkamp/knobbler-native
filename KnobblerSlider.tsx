import React from "react";
import { DarkTheme } from "@react-navigation/native";
import { sendOscMessage } from "./OscHandler";
import { DimensionValue, Text, View } from 'react-native';
import Slider from "@react-native-community/slider";

const DOUBLE_TAP_INTERVAL = 500
const EMPTY_STRING = '- - -'

// todo just use a local for each instance
const touchTimes = {}

export default function KnobblerSlider({ idx, oscData, topPct, leftPct, trackColor }) {
  // TODO this doesn't work to update the slider val all the time
  function handleTouch(idx: number) {
    console.log('HANDLE TOUCH', idx)
    const now = (new Date()).getTime()
    if (touchTimes[idx] && (now - touchTimes[idx]) < DOUBLE_TAP_INTERVAL) {
      sendOscMessage("/defaultval" + idx, [])
    }
    touchTimes[idx] = now
  }

  function sendSliderValue(idx: number, val: number) {
    const address = "/val" + idx
    sendOscMessage(address, [val])
    console.log("val: ", val, idx);
  }

  return (
    <View
      key={idx}
      style={{ position: "absolute", top: topPct as DimensionValue, left: leftPct as DimensionValue }}
    >
      <Text style={{ color: DarkTheme.colors.text, position: "relative", top: -80, left: 0, textAlign: "center", width: 196 }}
      >
        {oscData["/valStr" + idx] || EMPTY_STRING}
      </Text>
      <View
        key={idx}
        style={{ transform: [{ rotate: "-90deg" }] }}
      >
        <Slider
          style={{ width: 200 }}
          value={oscData["/val" + idx]}
          minimumValue={0}
          onTouchEnd={() => handleTouch(idx)}
          maximumValue={1}
          minimumTrackTintColor={trackColor}
          maximumTrackTintColor={trackColor + "44"}
          thumbTintColor={trackColor}
          onValueChange={(val) => { return sendSliderValue(idx, val) }}
          tapToSeek={true}
        />
      </View>
      <Text style={{ color: DarkTheme.colors.text, position: "relative", top: 90, left: 0, textAlign: "center", width: 196 }}>
        {oscData["/param" + idx] || EMPTY_STRING}
      </Text>
      <Text style={{ color: DarkTheme.colors.text, position: "relative", top: 100, left: 0, textAlign: "center", width: 196 }}>
        {oscData["/device" + idx] || EMPTY_STRING}
      </Text>
      <Text style={{ color: DarkTheme.colors.text, position: "relative", top: 110, left: 0, textAlign: "center", width: 196 }}>
        {oscData["/track" + idx] || EMPTY_STRING}
      </Text>
    </View>
  )
}