import React from "react";
import { useAppContext } from "./AppContext";
import { DarkTheme } from "@react-navigation/native";
import KnobblerSlider from './components/KnobblerSlider';
import { Button, StyleProp, Text, View, ViewStyle } from 'react-native';
import { sendOscMessage } from "./OscHandler";
// https://www.npmjs.com/package/@react-native-community/slider


function getSliders(oscData, isBlu: boolean = false, page: number = 1) {
  const rows = 2
  const cols = 8
  const widthPct = 100 / cols
  const heightPct = (isBlu ? 90 : 100) / rows
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
          sliderHeight={isBlu ? 250 : 320}
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

  const styles = {
    view: {
      flex: 1,
      gap: 0,
      flexWrap: "wrap",
      alignContent: "center",
      justifyContent: "space-evenly",
      flexDirection: "row"
    } as StyleProp<ViewStyle>
  }

  return (
    <View style={styles.view} >
      {getSliders(oscData, false, page)}
    </View >
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

  const shortcuts = []
  for (let idx = 1; idx <= 8; idx++) {
    const color = "#" + (oscData['/shortcut' + idx + 'Color'] || "990000").substring(0, 6)
    shortcuts.push(
      <View key={idx} style={{ backgroundColor: color + "44", width: "10%" }}>
        <Button color={color} onPress={() => console.log("CLICKED" + idx)} title={oscData['/shortcutName' + idx] || ("Shortcut " + idx)} />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <View style={{ marginTop: 40, flexShrink: 1, flexDirection: "row", alignContent: "center", justifyContent: "space-evenly" }}>
        {shortcuts}
      </View>
      <View style={{ flexDirection: "row", paddingHorizontal: 30, paddingTop: 30 }}>
        <Text style={{ flexGrow: 1, fontSize: 24, color: DarkTheme.colors.text }}>{oscData["/bcurrDeviceName"]}</Text>
        <Button title="<< Prev Bank" onPress={() => sendOscMessage("/bbankPrev", [])} />
        <Text style={{ color: DarkTheme.colors.text, marginTop: 10, fontSize: 16, paddingHorizontal: 20 }}>{oscData["/bTxtCurrBank"]}</Text>
        <Button title="Next Bank >>" onPress={() => sendOscMessage("/bbankNext", [])} />
      </View>
      <View style={{ flexGrow: 1, borderWidth: 0, borderColor: "yellow", flex: 1, flexWrap: "wrap", alignContent: 'center', justifyContent: 'space-evenly', flexDirection: "row" }}>
        {getSliders(oscData, true)}
      </View>
    </View>
  );
}

export default KnobblerScreen
export { SetupScreen, BluhandScreen }