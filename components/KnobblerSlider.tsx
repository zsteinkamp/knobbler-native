import React, { useRef } from "react";
import { sendOscMessage } from "../OscHandler";
import { DimensionValue, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import VerticalSlider from "./VerticalSlider"
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { useAppContext } from "../AppContext";
import { DEFAULT_COLOR, TEXT_COMMON } from "../lib/constants";

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // The slider makes mass warnings
});

const EMPTY_STRING = '- - -'

export default function KnobblerSlider({
  isBlu,
  isUnmapping,
  idx,
  oscData,
  sliderHeight,
  trackColor,
  value,
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
    <>
      <View style={{
        backgroundColor: "#" + DEFAULT_COLOR,
        height: isUnmapping ? sliderHeight : 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%"
      }} onTouchEnd={() => sendOscMessage("/unmap" + idx)}>
        <Text style={{ color: 'white' }}>UNMAP</Text>
      </View>
      <VerticalSlider
        ref={sliderRef}
        width={"100%" as DimensionValue}
        height={isUnmapping ? 0 : sliderHeight}
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
    </>
  )

  sliderRefsRef.current[valAddress] = sliderRef

  const sliderTextStyle = [
    TEXT_COMMON, {
      width: "100%",
      textAlign: "center"
    } as StyleProp<TextStyle>]

  const viewStyle = {
    backgroundColor: trackColor + "33",
    flex: 1,
    padding: 20,
  } as StyleProp<ViewStyle>

  return (
    <View
      style={viewStyle}
    >
      <Text numberOfLines={1} style={sliderTextStyle}>
        {oscData[valStrAddress] || EMPTY_STRING}
      </Text>
      <View style={{ width: "100%", paddingVertical: 10, marginHorizontal: "auto" }}>
        {slider}
      </View>
      <View style={{ width: "100%" }}>
        <Text numberOfLines={1} style={[sliderTextStyle, { fontWeight: "bold" }]}>
          {oscData[paramAddress] || EMPTY_STRING}
        </Text>
        {!isBlu && (
          <>
            <Text numberOfLines={1} style={sliderTextStyle}>
              {oscData[deviceAddress] || EMPTY_STRING}
            </Text>
            <Text onPress={() => sendOscMessage('/track' + idx + 'touch')} numberOfLines={1} style={sliderTextStyle}>
              {oscData[trackAddress] || EMPTY_STRING}
            </Text>
          </>
        )}
      </View>
    </View>
  )
}