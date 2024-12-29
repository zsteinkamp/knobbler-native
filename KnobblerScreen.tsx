import React from "react";
import { useAppContext } from "./AppContext";
import KnobblerSlider from './components/KnobblerSlider';
import { Text, View } from 'react-native';
// https://www.npmjs.com/package/@react-native-community/slider


function KnobblerScreen({ route }) {
  const { oscData } = useAppContext()
  const { page } = route.params

  const rows = 2
  const cols = 8
  const spacingPct = 12.25
  const widthPct = 10
  const startIdx = (rows * cols * ((page || 1) - 1)) + 1

  const sliders = []
  for (let row = 0; row < rows; row++) {
    const topPct = (row === 0 ? 5 : 52.5) + "%"
    for (let col = 0; col < cols; col++) {
      const idx = startIdx + (col + (cols * (row)))
      const leftPct = (2 + (spacingPct * col)) + "%"
      const trackColor = "#" + ((oscData["/val" + idx + "color"]) || "990000").substring(0, 6)

      sliders.push(
        <KnobblerSlider
          value={oscData["/val" + idx]}
          key={idx}
          idx={idx}
          sliderWidth={100}
          sliderHeight={260}
          oscData={oscData}
          topPct={topPct}
          leftPct={leftPct}
          width={widthPct + "%"}
          height={"42.5%"}
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