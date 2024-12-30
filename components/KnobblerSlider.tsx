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

const EMPTY_STRING = '- - -'

export default function KnobblerSlider({
  isBlu,
  height,
  idx,
  oscData,
  sliderHeight,
  trackColor,
  value,
  width,
}) {
  const { oscDataRef, setOscData, sliderRefsRef } = useAppContext()

  function sendSliderValue(address: string, val: number) {
    oscDataRef.current[address] = val
    setOscData({ ...oscDataRef.current })
    sendOscMessage(address, [val])
  }

  const valAddress = (isBlu ? "/bval" : "/val") + idx
  const valStrAddress = (isBlu ? "/bvalStr" : "/valStr") + idx
  const defaultAddress = (isBlu ? "/bdefaultval" : "/defaultval") + idx
  const paramAddress = (isBlu ? "/bparam" : "/param") + idx
  const deviceAddress = "/device" + idx
  const trackAddress = "/track" + idx

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
      onChange={(val) => sendSliderValue(valAddress, val)}
      onDoubleTap={() => sendOscMessage(defaultAddress, [])}
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
      <View style={{ width: "100%", padding: 10, marginHorizontal: "auto" }}>
        {slider}
      </View>
      <View style={{ width: "100%" }}>
        <Text style={{ width: "100%", textAlign: "center", color: DarkTheme.colors.text, fontWeight: "bold" }}>
          {oscData[paramAddress] || EMPTY_STRING}
        </Text>
        {!isBlu && (
          <>
            <Text style={{ width: "100%", textAlign: "center", color: DarkTheme.colors.text }}>
              {oscData[deviceAddress] || EMPTY_STRING}
            </Text>
            <Text style={{ width: "100%", textAlign: "center", color: DarkTheme.colors.text }}>
              {oscData[trackAddress] || EMPTY_STRING}
            </Text>
          </>
        )}
      </View>
    </View>
  )
}