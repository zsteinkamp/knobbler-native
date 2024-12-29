import React from "react";
import { DarkTheme } from "@react-navigation/native";
import { sendOscMessage } from "./OscHandler";
import { DimensionValue, Text, View } from 'react-native';
import RNVSlider from "rn-vertical-slider";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // The slider makes mass warnings
});

const DOUBLE_TAP_INTERVAL = 300
const EMPTY_STRING = '- - -'

// todo just use a local for each instance
const touchTimes = {}

export default function KnobblerSlider({ idx, oscData, topPct, leftPct, sliderHeight, sliderWidth, trackColor, width, height }) {
  // TODO this doesn't work to update the slider val all the time
  function handleTouch(idx: number) {
    const now = (new Date()).getTime()
    if (touchTimes[idx] && (now - touchTimes[idx]) < DOUBLE_TAP_INTERVAL) {
      sendOscMessage("/defaultval" + idx, [])
    }
    touchTimes[idx] = now
  }

  function sendSliderValue(idx: number, val: number) {
    const address = "/val" + idx
    sendOscMessage(address, [val])
  }

  return (
    <View
      style={{ backgroundColor: trackColor + "22", position: "absolute", top: topPct as DimensionValue, left: leftPct as DimensionValue, width: width, height: height, padding: 10 }}
    >
      <Text style={{ color: DarkTheme.colors.text, textAlign: "center" }}
      >
        {oscData["/valStr" + idx] || EMPTY_STRING}
      </Text>
      <View style={{ marginVertical: 10, marginHorizontal: "auto" }} onTouchEnd={() => handleTouch(idx)}>
        <RNVSlider
          width={sliderWidth}
          height={sliderHeight}
          value={oscData["/val" + idx]}
          min={0}
          max={1}
          step={0.001}
          minimumTrackTintColor={trackColor}
          maximumTrackTintColor={trackColor + "44"}
          onChange={(val) => { return sendSliderValue(idx, val) }}
        />
      </View>
      <View style={{ width: "100%" }}>
        <Text style={{ textAlign: "center", color: DarkTheme.colors.text, fontWeight: "bold" }}>
          {oscData["/param" + idx] || EMPTY_STRING}
        </Text>
        <Text style={{ textAlign: "center", color: DarkTheme.colors.text }}>
          {oscData["/device" + idx] || EMPTY_STRING}
        </Text>
        <Text style={{ textAlign: "center", color: DarkTheme.colors.text }}>
          {oscData["/track" + idx] || EMPTY_STRING}
        </Text>
      </View>
    </View>
  )
}