import React from "react";
import { DarkTheme } from "@react-navigation/native";
import { sendOscMessage } from "./OscHandler";
import { DimensionValue, Text, View } from 'react-native';
import Slider from "@react-native-community/slider";

const DOUBLE_TAP_INTERVAL = 500
const EMPTY_STRING = '- - -'

// todo just use a local for each instance
const touchTimes = {}

export default function KnobblerSlider({ idx, oscData, topPct, leftPct, sliderHeight, trackColor, width, height }) {
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
      <View style={{ height: 285 }}>
        <Slider
          style={{
            width: sliderHeight,
            transform: [
              { translateX: -70 },
              { translateY: 120 },
              { rotate: "-90deg" },
            ]
          }}
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