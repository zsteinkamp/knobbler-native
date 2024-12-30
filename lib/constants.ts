import { DarkTheme } from "@react-navigation/native"
import { StyleProp, TextStyle } from "react-native"

export const DEFAULT_COLOR = "990000"
export const TEXT_COMMON = {
  color: DarkTheme.colors.text,
  whiteSpace: "nowrap",
  overflow: "hidden",
} as StyleProp<TextStyle>