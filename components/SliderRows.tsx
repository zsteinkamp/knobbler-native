import React from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import SliderRow from "./SliderRow"

export default function SliderRows({ isBlu, page = 1, isUnmapping = false, screenH }) {
  const viewStyle = {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  } as StyleProp<ViewStyle>
  return (
    <View>
      <View style={viewStyle}>
        <SliderRow isBlu={isBlu} page={page} isUnmapping={isUnmapping} row={1} screenH={screenH} />
      </View>
      <View style={viewStyle}>
        <SliderRow isBlu={isBlu} page={page} isUnmapping={isUnmapping} row={2} screenH={screenH} />
      </View>
    </View>
  )
}
