import React from "react";
import { useAppContext } from "./AppContext";
import { DarkTheme } from "@react-navigation/native";
import KnobblerSlider from './components/KnobblerSlider';
import { Text, View } from 'react-native';
// https://www.npmjs.com/package/@react-native-community/slider


function getSliders(oscData, isBlu: boolean = false, page: number = 1) {
  const rows = 2
  const cols = 8
  const widthPct = 100 / cols
  const heightPct = (isBlu ? 80 : 100) / rows
  const startIdx = (rows * cols * ((page) - 1)) + 1

  const sliders = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const idx = startIdx + (col + (cols * (row)))
      const valAddress = (isBlu ? "/bval" : "/val") + idx
      const trackColor = "#" + ((oscData[valAddress + "color"]) || "990000").substring(0, 6)

      sliders.push(
        <KnobblerSlider
          isBlu={isBlu}
          value={oscData[valAddress]}
          key={idx}
          idx={idx}
          sliderHeight={isBlu ? 280 : 320}
          width={widthPct + "%"}
          height={heightPct + "%"}
          oscData={oscData}
          trackColor={trackColor}
        />
      )
    }
  }
  return sliders
}

function KnobblerScreen({ route }) {
  const { oscData } = useAppContext()
  const { page } = route.params

  return (
    <View style={{ borderWidth: 0, borderColor: "yellow", flex: 1, gap: 0, flexWrap: "wrap", alignContent: 'center', justifyContent: 'space-evenly', flexDirection: "row" }}>
      {getSliders(oscData, false, page)}
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
  const { oscData } = useAppContext()
  return (
    <>
      <View style={{ borderWidth: 1, borderColor: "yellow", flex: 1, flexDirection: "row", alignContent: "center", justifyContent: "space-evenly" }}>
        <Text style={{ borderWidth: 1, borderColor: "yellow", color: DarkTheme.colors.text, height: 20 }}>One</Text>
        <Text style={{ color: DarkTheme.colors.text, height: 20 }}>Two</Text>
        <Text style={{ color: DarkTheme.colors.text, height: 20 }}>Three</Text>
        <Text style={{ color: DarkTheme.colors.text, height: 20 }}>Four</Text>
        <Text style={{ color: DarkTheme.colors.text, height: 20 }}>Five</Text>
        <Text style={{ color: DarkTheme.colors.text, height: 20 }}>Six</Text>
        <Text style={{ color: DarkTheme.colors.text, height: 20 }}>Seven</Text>
        <Text style={{ color: DarkTheme.colors.text, height: 20 }}>Eight</Text>
      </View>
      <View style={{ borderWidth: 0, borderColor: "yellow", flex: 1, flexWrap: "wrap", alignContent: 'center', justifyContent: 'space-evenly', flexDirection: "row" }}>
        {getSliders(oscData, true)}
      </View>
    </>
  );
}

export default KnobblerScreen
export { SetupScreen, BluhandScreen }