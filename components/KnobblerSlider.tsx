import React, { useRef } from "react";
import { DarkTheme } from "@react-navigation/native";
import { sendOscMessage } from "../OscHandler";
import { DimensionValue, Text, View } from 'react-native';
import RNVSlider from "./VerticalSlider"
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { useAppContext } from "../AppContext";

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // The slider makes mass warnings
});

const DOUBLE_TAP_INTERVAL = 300
const EMPTY_STRING = '- - -'

// todo just use a local for each instance
const touchTimes = {}

export default function KnobblerSlider({
  height,
  idx,
  oscData,
  sliderHeight,
  trackColor,
  value,
  width,
}) {
  const { oscDataRef, setOscData, sliderRefsRef, setSliderRefs } = useAppContext()

  // TODO this doesn't work to update the slider val all the time
  function handleTouch(idx: number) {
    const now = (new Date()).getTime()
    if (touchTimes[idx] && (now - touchTimes[idx]) < DOUBLE_TAP_INTERVAL) {
      sendOscMessage("/defaultval" + idx, [])
      touchTimes[idx] = null
      return
    }
    touchTimes[idx] = now
  }

  function sendSliderValue(address: string, val: number) {
    oscDataRef.current[address] = val
    setOscData({ ...oscDataRef.current })
    sendOscMessage(address, [val])
  }

  const valAddress = "/val" + idx
  const valStrAddress = "/valStr" + idx

  const sliderRef = useRef(null)

  // define the slider so we can get a ref
  const slider = (
    <RNVSlider
      ref={sliderRef}
      width={"100%" as DimensionValue}
      height={sliderHeight}
      value={value}
      min={0}
      max={1}
      step={0.002} // 500 steps
      minimumTrackTintColor={trackColor}
      maximumTrackTintColor={trackColor + "44"}
      onChange={(val) => { return sendSliderValue(valAddress, val) }}
      useSpring={false}
    />
  )


  sliderRefsRef.current[valAddress] = sliderRef

  return (
    <View
      style={{ backgroundColor: trackColor + "22", width: width, height: height, padding: 10 }}
    >
      <Text style={{ color: DarkTheme.colors.text, textAlign: "center" }}
      >
        {oscData[valStrAddress] || EMPTY_STRING}
      </Text>
      <View style={{ width: "100%", padding: 10, marginHorizontal: "auto" }} onTouchEnd={() => handleTouch(idx)}>
        {slider}
      </View>
      <View style={{ width: "100%" }}>
        <Text style={{ width: "100%", textAlign: "center", color: DarkTheme.colors.text, fontWeight: "bold" }}>
          {oscData["/param" + idx] || EMPTY_STRING}
        </Text>
        <Text style={{ width: "100%", textAlign: "center", color: DarkTheme.colors.text }}>
          {oscData["/device" + idx] || EMPTY_STRING}
        </Text>
        <Text style={{ width: "100%", textAlign: "center", color: DarkTheme.colors.text }}>
          {oscData["/track" + idx] || EMPTY_STRING}
        </Text>
      </View>
    </View>
  )
}