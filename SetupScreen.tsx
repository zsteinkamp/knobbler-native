import React from "react";
import { Button, Switch, Text, View } from "react-native";
import { useAppContext } from "./AppContext";
import OscList from "./components/OscList";
import AutoDiscovery from "./components/AutoDiscovery";
import { DarkTheme, useNavigation } from "@react-navigation/native";
import { OscSender } from "./OscHandler";
import { ACCENT2_COLOR, TEXT_COMMON, TEXT_HEADER } from "./lib/constants";

export default function SetupScreen() {
  const { lastOscReceived, lastOscSent, setLastOscReceived, setLastOscSent, serverHost, serverPort, collectOsc, setCollectOsc } = useAppContext()
  const navigation = useNavigation();

  const oscSender = OscSender(collectOsc, lastOscSent, setLastOscSent)

  React.useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => { oscSender.send("/btnRefresh") }} title="Refresh" />
      ),
    });
  }, [navigation]);

  const toggleSwitch = () => {
    setCollectOsc(!collectOsc)
  }
  /*
  trackColor={{ false: '#767577', true: '#81b0ff' }}
  thumbColor={collectOsc ? '#f5dd4b' : '#f4f3f4'}
  ios_backgroundColor="#3e3e3e"
  */

  return (
    <View style={{ padding: 40, gap: 40, flexDirection: "row", flexGrow: 1 }}>
      <View style={{ flex: 1, borderWidth: 0, borderColor: "white" }}>
        <View style={{ flex: 1, flexGrow: 1 }}>
          <Text style={[TEXT_HEADER, { marginBottom: 20 }]}>
            Knobbler Max Device Connection
          </Text>
          <View>
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
              <Text style={[TEXT_COMMON, { flex: 1 }]}>Hostname:</Text>
              <Text style={[TEXT_COMMON, { flex: 4, fontWeight: "bold" }]}>{serverHost}</Text>
            </View>
            <View style={{ flexDirection: "row", marginBottom: 40 }}>
              <Text style={[TEXT_COMMON, { flex: 1 }]}>Port:</Text>
              <Text style={[TEXT_COMMON, { flex: 4, fontWeight: "bold" }]}>{serverPort}</Text>
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
        {collectOsc && (
          <>
            <View style={{ flex: 1, marginBottom: 20, borderWidth: 0, borderColor: "red" }}>
              <OscList title="Last Osc Sent" data={lastOscSent} setData={setLastOscSent} />
            </View>
            <View style={{ flex: 1, marginTop: 20 }}>
              <OscList title="Last Osc Received" data={lastOscReceived} setData={setLastOscReceived} />
            </View>
          </>
        )}
      </View>
    </View>
  );
}
