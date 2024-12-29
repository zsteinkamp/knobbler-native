import React from "react";
import { useAppContext } from "./AppContext";
import KnobblerSlider from './KnobblerSlider';
import { Text, View } from 'react-native';
// https://www.npmjs.com/package/@react-native-community/slider


function KnobblerScreen({ theme }) {
  const { oscData } = useAppContext()

  const rows = 2
  const cols = 8

  const sliders = []
  for (let row = 0; row < rows; row++) {
    const topPct = (20 + (80 / rows) * row) + "%"
    for (let col = 0; col < cols; col++) {
      const leftPct = (5 + ((90 / cols) * col)) + "%"
      const idx = 1 + (col + (cols * (row)))
      const trackColor = "#" + ((oscData["/val" + idx + "color"]) || "990000").substring(0, 6)
      sliders.push(
        <KnobblerSlider
          idx={idx}
          oscData={oscData}
          topPct={topPct}
          leftPct={leftPct}
          trackColor={trackColor}
        />
      )
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {sliders}
    </View>
  );
}

function SetupScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Setup Screen</Text>
    </View>
  );
}

function BluhandScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Bluhand Screen</Text>
    </View>
  );
}

export default KnobblerScreen
export { SetupScreen, BluhandScreen }