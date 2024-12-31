import React from "react";
import { Button, Text, View } from "react-native";
import { useAppContext } from "./AppContext";
import OscList from "./components/OscList";
import AutoDiscovery from "./components/AutoDiscovery";
import { useNavigation } from "@react-navigation/native";
import { OscSender } from "./OscHandler";
import { TEXT_COMMON } from "./lib/constants";

export default function SetupScreen() {
  const { lastOscReceived, lastOscSent, setLastOscReceived, setLastOscSent, serverHost, serverPort } = useAppContext()
  const navigation = useNavigation();

  const oscSender = OscSender(lastOscSent, setLastOscSent)

  /* TODO put in headers (knobbler and bluhand and setup why not if you are troubleshooting and want to receive. maybe add send ping to send?
        <View style={{ flex: 1, flexGrow: 1 }}>
          <Button title="Refresh UI" onPress={() => oscSender.send('/btnRefresh')} />
        </View>
  */
  React.useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => { oscSender.send("/btnRefresh") }} title="Refresh" />
      ),
    });
  }, [navigation]);


  return (
    <View style={{ padding: 40, gap: 40, flexDirection: "row", flexGrow: 1 }}>
      <View style={{ flex: 1, borderWidth: 0, borderColor: "white" }}>
        <View style={{ flex: 1, flexGrow: 1 }}>
          <Text style={[TEXT_COMMON, { marginBottom: 20, fontSize: 24, fontWeight: "bold" }]}>
            Knobbler Device Connection
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
        <View style={{ flex: 1, marginBottom: 20, borderWidth: 0, borderColor: "red" }}>
          <OscList title="Last Osc Sent" data={lastOscSent} setData={setLastOscSent} />
        </View>
        <View style={{ flex: 1, marginTop: 20 }}>
          <OscList title="Last Osc Received" data={lastOscReceived} setData={setLastOscReceived} />
        </View>
      </View>
    </View>
  );
}
