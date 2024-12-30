import React, { useState } from "react";
import { useAppContext } from "./AppContext";
import { useNavigation } from "@react-navigation/native";
import KnobblerSlider from './components/KnobblerSlider';
import { Button, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { sendOscMessage } from "./OscHandler";
import { DEFAULT_COLOR, TEXT_COMMON } from "./lib/constants";
// https://www.npmjs.com/package/@react-native-community/slider


function getSliders({
  oscData,
  isBlu = false,
  page = 1,
  isUnmapping = false,
  row,
}) {
  const rows = 2

  const cols = 8
  const startIdx = (rows * cols * ((page) - 1)) + 1

  const sliders = []
  for (let col = 0; col < cols; col++) {
    const idx = startIdx + col + ((row - 1) * cols)

    const valAddress = (isBlu ? "/bval" : "/val") + idx
    const trackColor = "#" + ((oscData[valAddress + "color"]) || DEFAULT_COLOR).substring(0, 6)

    sliders.push(
      <KnobblerSlider
        isBlu={isBlu}
        isUnmapping={isUnmapping}
        value={oscData[valAddress]}
        key={idx}
        idx={idx}
        sliderHeight={isBlu ? 260 : 310}
        oscData={oscData}
        trackColor={trackColor}
      />
    )
  }
  return sliders
}

function getSliderRows({ oscData, isBlu, page = 1, isUnmapping = false }) {
  const viewStyle = {
    flexDirection: "row",
  } as StyleProp<ViewStyle>

  return (
    <>
      <View style={viewStyle}>
        {getSliders({ oscData, isBlu, page, isUnmapping, row: 1 })}
      </View>
      <View style={viewStyle}>
        {getSliders({ oscData, isBlu, page, isUnmapping, row: 2 })}
      </View>
    </>
  )
}

function KnobblerScreen({ route }) {
  const navigation = useNavigation();
  const { oscData } = useAppContext()
  const { page } = route.params

  const [isUnmapping, setIsUnmapping] = useState(false)

  React.useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerLeft: () => (
        <Button color="#990000" onPress={() => { setIsUnmapping(u => !u) }} title="Unmap" />
      ),
    });
  }, [navigation]);

  return (
    <View style={{ marginTop: 20 }}>
      {getSliderRows({ oscData, isBlu: false, page, isUnmapping })}
    </View>
  )
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
    const color = "#" + (oscData['/shortcut' + idx + 'Color'] || DEFAULT_COLOR).substring(0, 6)
    shortcuts.push(
      <View key={idx} style={{ flex: 1, backgroundColor: color + "44" }}>
        <Button color={color} onPress={() => sendOscMessage('/mapshortcut' + idx)} title={oscData['/shortcutName' + idx] || ("Shortcut " + idx)} />
      </View>
    )
  }

  return (
    <View>
      <View style={{ marginTop: 40, marginHorizontal: 20, gap: 40, flexDirection: "row", alignContent: "center", justifyContent: "space-evenly" }}>
        {shortcuts}
      </View>
      <View style={{ borderWidth: 0, borderColor: 'yellow', flexDirection: "row", marginHorizontal: 30, marginTop: 40, marginBottom: 20 }}>
        <Text numberOfLines={1} style={[TEXT_COMMON, { flexGrow: 1, fontSize: 24, fontWeight: "bold", marginTop: 4 }]}>
          {oscData["/bcurrDeviceName"]}
        </Text>
        <Button title="<< Prev Bank" onPress={() => sendOscMessage("/bbankPrev")} />
        <Text style={[TEXT_COMMON, { marginTop: 10, fontSize: 16, paddingHorizontal: 20 }]}>
          {oscData["/bTxtCurrBank"]}
        </Text>
        <Button title="Next Bank >>" onPress={() => sendOscMessage("/bbankNext")} />
      </View>
      {getSliderRows({ oscData, isBlu: true })}
    </View>
  );
}

export default KnobblerScreen
export { SetupScreen, BluhandScreen }