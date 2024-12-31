import React, { useEffect, useRef, useState } from "react";
import { Dimensions, View, Text, Button, StyleProp, ViewStyle } from "react-native";
import { useAppContext } from "./AppContext";
import { useNavigation } from "@react-navigation/native";
import { DEFAULT_COLOR, TEXT_COMMON } from "./lib/constants";
import SliderRows from "./components/SliderRows";
import { sendOscMessage } from "./OscHandler";

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');

function BluhandScreen() {
  const { oscData } = useAppContext()
  const navigation = useNavigation();

  const [isUnmapping, setIsUnmapping] = useState(false)

  const ref = useRef(null);

  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ window, screen }) => {
        setDimensions({ window, screen });
      },
    );
    return () => subscription?.remove();
  });

  React.useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerLeft: () => (
        <Button color="#990000" onPress={() => { setIsUnmapping(u => !u) }} title="Unmap" />
      ),
    });
  }, [navigation]);

  const shortcuts = []
  for (let idx = 1; idx <= 8; idx++) {
    const color = "#" + (oscData['/shortcut' + idx + 'Color'] || DEFAULT_COLOR).substring(0, 6)
    const title = oscData['/shortcutName' + idx] || ("Shortcut " + idx)
    const style = { borderWidth: 1, flex: 1, backgroundColor: color + "44" } as StyleProp<ViewStyle>
    const address = (isUnmapping ? '/unmapshortcut' : '/mapshortcut') + idx
    shortcuts.push(
      <View key={idx} style={[style, isUnmapping ? { borderColor: "red" } : null]}>
        <Text
          numberOfLines={1}
          style={{
            color,
            textAlign: "center",
            padding: 10,
          }}
          onPress={() => sendOscMessage(address)}
        >
          {title}
        </Text>
      </View>
    )
  }

  return (
    <View>
      <View style={{
        marginTop: 20,
        marginHorizontal: 15,
        gap: 20,
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-evenly"
      }}>
        {shortcuts}
      </View>
      <View style={{
        borderWidth: 0,
        borderColor: 'yellow',
        flexDirection: "row",
        marginHorizontal: 30,
        marginTop: 20,
        marginBottom: 10
      }}>
        <Text numberOfLines={1} style={[TEXT_COMMON, {
          flexGrow: 1,
          fontSize: 24,
          fontWeight: "bold",
          marginTop: 4
        }]}>
          {oscData["/bcurrDeviceName"]}
        </Text>
        <Button title="<< Prev Bank" onPress={() => sendOscMessage("/bbankPrev")} />
        <Text style={[TEXT_COMMON, {
          marginTop: 10,
          fontSize: 16,
          paddingHorizontal: 20
        }]}>
          {oscData["/bTxtCurrBank"]}
        </Text>
        <Button title="Next Bank >>" onPress={() => sendOscMessage("/bbankNext")} />
      </View>
      <SliderRows oscData={oscData} isBlu={true} screenH={dimensions.window.height} />
    </View>
  );
}


export default BluhandScreen