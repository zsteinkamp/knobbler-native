import React, { useMemo, useRef } from "react";
import { OscSend } from "../OscHandler";
import { DimensionValue, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import VerticalSlider from "./VerticalSlider"
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { useAppContext } from "../AppContext";
import { TEXT_COMMON } from "../lib/constants";

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
  sliderHeight,
  trackColor,
  value,
}) {
  const { collectOsc, oscDataRef, sliderRefsRef, lastOscSentRef, setLastOscSent } = useAppContext()

  function sendSliderValue(address: string, val: number) {
    oscDataRef.current[address] = val
    OscSend(collectOsc, lastOscSentRef, setLastOscSent, address, [val])
  }

  const valAddress = (isBlu ? "/bval" : "/val") + idx
  const valStrAddress = (isBlu ? "/bvalStr" : "/valStr") + idx
  const defaultAddress = (isBlu ? "/bdefaultval" : "/defaultval") + idx
  const paramAddress = (isBlu ? "/bparam" : "/param") + idx
  const deviceAddress = "/device" + idx
  const trackAddress = "/track" + idx

  const sliderRef = useRef(null)

  // define the slider so we can get a ref
  const slider = useMemo(() => {
    //console.log('RENDER VERTICALS', valAddress)
    return (
      //const slider = (
      <>
        <VerticalSlider
          ref={sliderRef}
          width={"100%" as DimensionValue}
          height={sliderHeight}
          value={oscDataRef?.current[valAddress]}
          min={0}
          max={1}
          step={0.002} // 500 steps
          minimumTrackTintColor={trackColor}
          maximumTrackTintColor={trackColor + "11"}
          onChange={(val) => sendSliderValue(valAddress, val)}
          onTapNumTaps={isUnmapping ? 1 : 2}
          onTap={isUnmapping ? () => OscSend(collectOsc, lastOscSentRef, setLastOscSent, "/unmap" + idx) : () => OscSend(collectOsc, lastOscSentRef, setLastOscSent, defaultAddress, [])}
          useSpring={false}
          containerStyle={{ borderWidth: 1, borderColor: isUnmapping && "red" }}
        />
      </>
    )
  }, [isUnmapping, trackColor, sliderHeight, sliderRef])

  sliderRefsRef.current[valAddress] = sliderRef

  const sliderValStrStyle = [
    TEXT_COMMON, {
      width: "100%",
      textAlign: "center",
    } as StyleProp<TextStyle>]
  const sliderTextStyle = [
    TEXT_COMMON, {
      textAlign: "left",
      marginLeft: 5,
    } as StyleProp<TextStyle>]

  const viewStyle = {
    backgroundColor: trackColor + "33",
    flex: 1,
    padding: 10,
    borderRadius: 10,
  } as StyleProp<ViewStyle>

  return useMemo(() => {
    //console.log('RENDER SLIDER ' + valStrAddress)
    let valStr = oscDataRef?.current[valStrAddress]?.toString()
    if (valStr && valStr.length > 10 && valStr.match(/^[0-9-.]+$/)) {
      // special case long ass float
      valStr = oscDataRef.current[valStrAddress].toFixed(3)
    }
    return (
      <View
        style={viewStyle}
      >
        <Text numberOfLines={1} style={sliderValStrStyle}>
          {valStr || EMPTY_STRING}
        </Text>
        <View style={{ width: "100%", paddingVertical: 10, marginHorizontal: "auto" }}>
          {slider}
        </View>
        <View style={{ width: "100%" }}>
          <Text numberOfLines={1} style={[sliderTextStyle, isBlu ? {} : { fontWeight: "bold" }]}>
            {oscDataRef.current[paramAddress] || EMPTY_STRING}
          </Text>
          {!isBlu && (
            <>
              <Text numberOfLines={1} style={sliderTextStyle}>
                {oscDataRef.current[deviceAddress] || EMPTY_STRING}
              </Text>
              <Text onPress={() => OscSend(collectOsc, lastOscSentRef, setLastOscSent, '/track' + idx + 'touch')} numberOfLines={1} style={[sliderTextStyle, { opacity: 0.66 }]}>
                {oscDataRef.current[trackAddress] || EMPTY_STRING}
              </Text>
            </>
          )}
        </View>
      </View>
    )
  }, [
    oscDataRef.current[valStrAddress],
    oscDataRef.current[paramAddress],
    oscDataRef.current[deviceAddress],
    oscDataRef.current[trackAddress],
    trackColor, sliderHeight, sliderRef, isUnmapping,
  ])
}