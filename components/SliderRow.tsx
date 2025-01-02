import React from "react"
import KnobblerSlider from "./KnobblerSlider"
import { DEFAULT_COLOR } from "../lib/constants"
import { useAppContext } from "../AppContext"

export default function SliderRow({
  isBlu = false,
  page = 1,
  isUnmapping = false,
  row,
  screenH
}) {
  const { oscDataRef } = useAppContext()
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
    const trackColor = (oscDataRef.current[colorAddress] ? "#" + oscDataRef.current[colorAddress] : DEFAULT_COLOR).substring(0, 7)
    //console.log('TRACKCOLOR', trackColor)

    sliders.push(
      <KnobblerSlider
        isBlu={isBlu}
        isUnmapping={isUnmapping}
        value={oscDataRef.current[valAddress]}
        key={idx}
        idx={idx}
        sliderHeight={sliderHeight}
        trackColor={trackColor}
      />
    )
  }
  return sliders
}
