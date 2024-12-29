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
  const widthPct = 100 / cols
  const heightPct = 100 / rows
  const startIdx = (rows * cols * ((page || 1) - 1)) + 1

  function getSliders() {
    const sliders = []
    for (const row of [0, 1]) {
      for (let col = 0; col < cols; col++) {
        const idx = startIdx + (col + (cols * (row)))
        const trackColor = "#" + ((oscData["/val" + idx + "color"]) || "990000").substring(0, 6)

        sliders.push(
          <KnobblerSlider
            value={oscData["/val" + idx]}
            key={idx}
            idx={idx}
            sliderHeight={320}
            width={widthPct + "%"}
            oscData={oscData}
            height={heightPct + "%"}
            trackColor={trackColor}
          />
        )
      }
    }
    return sliders
  }

  return (
    <View style={{ borderWidth: 0, borderColor: "yellow", flex: 1, gap: 0, flexWrap: "wrap", alignContent: 'center', justifyContent: 'space-evenly', flexDirection: "row" }}>
      {getSliders()}
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