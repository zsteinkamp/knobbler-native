import { DarkTheme } from "@react-navigation/native"
import { StyleProp, TextStyle } from "react-native"

export const RETAIN_OSC_MSG_COUNT = 100
export const DEFAULT_COLOR = "990000"
export const TEXT_COMMON = {
  color: DarkTheme.colors.text,
  whiteSpace: "nowrap",
  overflow: "hidden",
} as StyleProp<TextStyle>
export const TEXT_HEADER = [
  TEXT_COMMON,
  {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFCC33",
    opacity: 0.5,
  }] as StyleProp<TextStyle>