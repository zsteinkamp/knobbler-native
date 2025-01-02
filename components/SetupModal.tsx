import React from 'react';
import { Text, View } from 'react-native';
import { DarkTheme } from "@react-navigation/native";
import { ACCENT1_COLOR, TEXT_COMMON } from '../lib/constants';
import { useAppContext } from '../AppContext';

export default function SetupModal() {
  const { serverHost, serverPort } = useAppContext()

  if (serverHost && serverPort) {
    return null
  }
  return (
    <View style={{
      opacity: .75,
      backgroundColor: DarkTheme.colors.background,
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Text style={[TEXT_COMMON, { fontSize: 48, color: ACCENT1_COLOR }]}>
        Make a Connection
      </Text>
      <Text style={[TEXT_COMMON, { fontSize: 24 }]}>
        Visit the ⚙️ Setup tab below 👇 to get started...
      </Text>
    </View>
  )
}