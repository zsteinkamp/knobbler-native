import React from "react";
import { View } from "react-native";
import { useAppContext } from "./AppContext";
import OscList from "./components/OscList";

export default function SetupScreen() {
  const { lastOscReceived, lastOscSent, setLastOscReceived, setLastOscSent } = useAppContext()

  return (
    <View style={{ padding: 40, gap: 40, flexDirection: "row" }}>
      <OscList containerStyle={{}} title="Last Osc Sent" data={lastOscSent} setData={setLastOscSent} />
      <OscList containerStyle={{}} title="Last Osc Received" data={lastOscReceived} setData={setLastOscReceived} />
    </View>
  );
}