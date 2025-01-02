import React, { useEffect, useState } from "react";
import { Dimensions, View, Text, Button, StyleProp, ViewStyle, TouchableHighlight } from "react-native";
import { useAppContext } from "./AppContext";
import { useNavigation } from "@react-navigation/native";
import { DEFAULT_COLOR, TEXT_COMMON } from "./lib/constants";
import SliderRows from "./components/SliderRows";
import { OscSend } from "./OscHandler";
import SetupModal from "./components/SetupModal";

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');

function BluhandScreen() {
  const { oscDataRef } = useAppContext()
  const navigation = useNavigation();
  const { serverHost, serverPort, collectOsc, lastOscSentRef, setLastOscSent } = useAppContext()

  const [isUnmapping, setIsUnmapping] = useState(false)

  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });

  // track changing window dimensions (rotate, split, etc)
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
    if (!serverHost || !serverPort) {
      return
    }
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerLeft: () => (
        <Button color={DEFAULT_COLOR} onPress={() => { setIsUnmapping(u => !u) }} title="Unmap" />
      ),
      headerRight: () => (
        <Button onPress={() => { OscSend(collectOsc, lastOscSentRef, setLastOscSent, "/btnRefresh") }} title="Refresh" />
      ),
    });
  }, [navigation, serverHost, serverPort]);

  const shortcuts = []
  for (let idx = 1; idx <= 8; idx++) {
    const colorKey = '/shortcut' + idx + 'Color'
    const color = (oscDataRef.current[colorKey] ?
      "#" + oscDataRef.current[colorKey]
      : DEFAULT_COLOR).substring(0, 7)
    const title = oscDataRef.current['/shortcutName' + idx] || ("Shortcut " + idx)
    const style = { borderRadius: 10, overflow: "hidden", borderWidth: 1, flex: 1, backgroundColor: color + "44" } as StyleProp<ViewStyle>
    const address = (isUnmapping ? '/unmapshortcut' : '/mapshortcut') + idx
    shortcuts.push(
      <View key={idx} style={[{ flex: 1, }, style, isUnmapping ? { borderColor: "red" } : null]}>
        <TouchableHighlight onPress={() => OscSend(collectOsc, lastOscSentRef, setLastOscSent, address)} underlayColor={color + "44"}>
          <Text
            numberOfLines={1}
            style={{
              color,
              fontSize: 19,
              fontWeight: "bold",
              textAlign: "center",
              paddingHorizontal: 10,
              paddingVertical: 16,
            }}
          >
            {title}
          </Text>
        </TouchableHighlight>
      </View >
    )
  }

  return (
    <View style={{ marginTop: 0, marginHorizontal: 10 }}>
      <View style={{
        marginTop: 15,
        marginHorizontal: 0,
        gap: 8,
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
        marginHorizontal: 10,
        marginTop: 20,
        marginBottom: 10
      }}>
        <Text numberOfLines={1} style={[TEXT_COMMON, {
          flexGrow: 1,
          fontSize: 24,
          fontWeight: "bold",
          marginTop: 4
        }]}>
          {oscDataRef.current["/bcurrDeviceName"]}
        </Text>
        <Button title="← Prev Bank" onPress={() => OscSend(collectOsc, lastOscSentRef, setLastOscSent, "/bbankPrev")} />
        <Text style={[TEXT_COMMON, {
          marginTop: 8,
          fontSize: 19,
          paddingHorizontal: 20
        }]}>
          {oscDataRef.current["/bTxtCurrBank"]}
        </Text>
        <Button title="Next Bank →" onPress={() => OscSend(collectOsc, lastOscSentRef, setLastOscSent, "/bbankNext")} />
      </View>
      <SliderRows isBlu={true} screenH={dimensions.window.height} />
      <SetupModal />
    </View>
  );
}


export default BluhandScreen