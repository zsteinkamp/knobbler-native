import React from "react"
import KnobblerSlider from "./KnobblerSlider"
import { DEFAULT_COLOR } from "../lib/constants"

export default function SliderRow({
  oscData,
  isBlu = false,
  page = 1,
  isUnmapping = false,
  row,
  screenH
}) {
  const rows = 2

  const cols = 8
  const startIdx = (rows * cols * ((page) - 1)) + 1

  const sliderOverhead = isBlu ? 202 : 251.75
  const otherOverhead = isBlu ? 56 : -100
  const sliderHeight = ((screenH - otherOverhead) / 2) - sliderOverhead

  const sliders = []
  for (let col = 0; col < cols; col++) {
    const idx = startIdx + col + ((row - 1) * cols)

    const valAddress = (isBlu ? "/bval" : "/val") + idx
    const colorAddress = valAddress + "color"
    const trackColor = (oscData[colorAddress] ? "#" + oscData[colorAddress] : DEFAULT_COLOR).substring(0, 7)
    //console.log('TRACKCOLOR', trackColor)

    sliders.push(
      <KnobblerSlider
        isBlu={isBlu}
        isUnmapping={isUnmapping}
        value={oscData[valAddress]}
        key={idx}
        idx={idx}
        sliderHeight={sliderHeight}
        oscData={oscData}
        trackColor={trackColor}
      />
    )
  }
  return sliders
}
