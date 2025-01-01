import React from "react";
import { Button, Switch, Text, TextInput, View } from "react-native";
import { useAppContext } from "./AppContext";
import OscList from "./components/OscList";
import AutoDiscovery from "./components/AutoDiscovery";
import { DarkTheme, useNavigation } from "@react-navigation/native";
import { OscSend } from "./OscHandler";
import { DEFAULT_COLOR, TEXT_COMMON, TEXT_HEADER } from "./lib/constants";

export default function SetupScreen() {
  const { lastOscReceived, lastOscSent, setLastOscReceived, setLastOscSent, serverHost, setServerHost, serverPort, setServerPort, collectOsc, setCollectOsc, lastOscSentRef, lastOscReceivedRef } = useAppContext()
  const navigation = useNavigation();

  React.useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => { OscSend(collectOsc, lastOscSentRef, setLastOscSent, "/btnRefresh") }} title="Refresh" />
      ),
    });
  }, [navigation, collectOsc, serverHost, serverPort]);

  const toggleSwitch = () => {
    setCollectOsc(!collectOsc)
  }

  const clearConnection = async () => {
    setServerHost(null)
    setServerPort(null)
  }

  const INPUT_COMMON = {
    borderWidth: 1,
    borderColor: DarkTheme.colors.border,
    padding: 10,
    borderRadius: 10,
  }

  return (
    <View style={{ padding: 40, gap: 40, flexDirection: "row", flexGrow: 1 }}>
      <View style={{ flex: 1, borderWidth: 0, borderColor: "white" }}>
        <View style={{ flex: 1, flexGrow: 1 }}>
          <Text style={[TEXT_HEADER, { marginBottom: 20 }]}>
            Knobbler Max Device Connection
          </Text>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 2 }}>
              <View style={{ flexDirection: "row", marginBottom: 10 }}>
                <Text style={[TEXT_COMMON, { paddingVertical: 10, flex: 1 }]}>Hostname:</Text>
                <TextInput
                  style={[TEXT_COMMON, INPUT_COMMON, { flex: 4 }]}
                  onChangeText={setServerHost}
                  value={serverHost}
                />
              </View>
              <View style={{ flexDirection: "row", marginBottom: 40 }}>
                <Text style={[TEXT_COMMON, { paddingVertical: 10, flex: 1 }]}>Port:</Text>
                <TextInput
                  style={[TEXT_COMMON, INPUT_COMMON, { flex: 4 }]}
                  onChangeText={setServerPort}
                  value={serverPort ? serverPort.toString() : null}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Button color={DEFAULT_COLOR} title="Clear" onPress={clearConnection} />
            </View>
          </View>
          <AutoDiscovery />
        </View>
      </View>
      <View style={{ flex: 1, flexGrow: 1 }}>
        <View style={{ flexDirection: "row", marginBottom: 40 }}>
          <Switch
            trackColor={{ true: DarkTheme.colors.primary, false: '#767577' }}
            thumbColor={collectOsc ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={collectOsc}
          />
          <Text style={[TEXT_COMMON, { marginTop: 8, marginLeft: 16, flexGrow: 1 }]}>OSC Debug (has a performance impact)</Text>
        </View>
        {collectOsc && serverHost && serverPort && (
          <>
            <View style={{ flex: 1, marginBottom: 20, borderWidth: 0, borderColor: "red" }}>
              <OscList title="Last Osc Sent" data={lastOscSent} dataRef={lastOscSentRef} setData={setLastOscSent} />
            </View>
            <View style={{ flex: 1, marginTop: 20 }}>
              <OscList title="Last Osc Received" data={lastOscReceived} dataRef={lastOscReceivedRef} setData={setLastOscReceived} />
            </View>
          </>
        )}
      </View>
    </View>
  );
}
