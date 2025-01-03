import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "./AppContext";
import { useNavigation } from "@react-navigation/native";
import { Button, Dimensions, View } from 'react-native';
import SliderRows from "./components/SliderRows";
import { OscSend } from "./OscHandler";
import SetupModal from "./components/SetupModal";

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');

export default function KnobblerScreen({ route }) {
  const navigation = useNavigation();
  const { serverHost, serverPort, collectOsc, lastOscSentRef, setLastOscSent } = useAppContext()
  const { page } = route.params

  const [isUnmapping, setIsUnmapping] = useState(false)

  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });

  // track changing dimensions (rotating, split screen, etc)
  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ window, screen }) => {
        setDimensions({ window, screen });
      },
    );
    return () => subscription?.remove();
  });
  const ref = useRef(null);

  React.useEffect(() => {
    if (!serverHost || !serverPort) {
      return
    }
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerLeft: () => (
        <Button color="#990000" onPress={() => { setIsUnmapping(u => !u) }} title="Unmap" />
      ),
      headerRight: () => (
        <Button onPress={() => { OscSend(collectOsc, lastOscSentRef, setLastOscSent, "/btnRefresh") }} title="Refresh" />
      ),
    });
  }, [navigation, serverHost, serverPort]);

  return (
    <View ref={ref} style={{ marginTop: 15, marginHorizontal: 10 }}>
      <SliderRows isBlu={false} page={page} isUnmapping={isUnmapping} screenH={dimensions.window.height} />
      <SetupModal />
    </View>
  )
}