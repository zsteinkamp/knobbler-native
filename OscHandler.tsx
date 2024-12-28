import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from './AppContext'

import osc from 'expo-osc';
import { NativeEventEmitter } from 'react-native';

type OscMessageData = (number | string)[]
type OscMessageAddress = string
type OscMessage = { address: OscMessageAddress, data: OscMessageData }

export function sendOscMessage(address: string, data: OscMessageData) {
  osc.sendMessage(address, data)
}

const eventEmitter = new NativeEventEmitter(osc);

function OscHandler({ children }) {
  const { setOscData, oscDataRef } = useAppContext()
  const [listener, setListener] = useState(null)

  console.log("OSC HANDLER TOP")

  const handleMessage = (oscMessage: OscMessage) => {
    if (oscMessage.address.match(/^\/[bcs]/)) {
      return
    }
    console.log("HANDLE_MESSAGE", oscMessage)
    // straight to the ref instead of setOscData() from useState
    // thx https://medium.com/geographit/accessing-react-state-in-event-listeners-with-usestate-and-useref-hooks-8cceee73c559
    oscDataRef.current[oscMessage.address] = oscMessage.data[0]
    setOscData({ ...oscDataRef.current })
  }

  const _subscribe = () => {
    console.log("SUBSCRIBE")
    const ListenPort = 2347;
    const PeerHost = "10.1.2.16";
    const PeerPort = 2346;

    osc.createClient(PeerHost, PeerPort);
    osc.createServer(ListenPort);
    setListener(eventEmitter.addListener('GotMessage', handleMessage))
  }
  const _unsubscribe = () => {
    console.log("UNSUBSCRIBE")
    listener && listener.remove();
    setListener(null);
  }

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  return (<>{children}</>)
}

export default OscHandler