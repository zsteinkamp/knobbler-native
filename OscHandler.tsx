import React, { useEffect, useState } from 'react';
import { useAppContext } from './AppContext'

import osc from 'expo-osc';
import { NativeEventEmitter } from 'react-native';

const ListenPort = 2347;
const PeerHost = "10.1.2.16";
const PeerPort = 2346;

osc.createClient(PeerHost, PeerPort);

export function sendMsgs() {
  osc.sendMessage("/address/", ["foobar", 0.5]);
  osc.sendMessage("/address/", ["string value", 1, false, 0.5]);
}

type OscMessageData = (number | string)[]
type OscMessageAddress = string
type OscMessage = { address: OscMessageAddress, data: OscMessageData }

export function sendOscMessage(address: string, data: OscMessageData) {
  osc.sendMessage(address, data)
}

const eventEmitter = new NativeEventEmitter(osc);
const pendingMessages = []

function OscHandler({ children }) {
  const { oscData, setOscData } = useAppContext()
  const [listener, setListener] = useState(null)
  const [timer, setTimer] = useState(null)

  console.log("OUT HERE")

  const processMessages = () => {
    console.log("HERE")
    if (!pendingMessages.length) {
      return
    }
    let oscMessage: OscMessage
    const newData = { ...oscData }
    while (oscMessage = pendingMessages.shift()) {
      console.log('PROCESSING', oscMessage)
      if (oscMessage.address.match(/^\/[bc]/)) {
        continue
      }
      newData[oscMessage.address] = oscMessage.data[0]
    }
    setOscData(newData)
  }

  const handleMessage = (oscMessage: OscMessage) => {
    console.log("HANDLE_MESSAGE", oscMessage)
    pendingMessages.push(oscMessage)
    if (timer) {
      timer.cancel()
    }
    setTimer(setTimeout(processMessages))
  }

  const _subscribe = () => {
    console.log("SUBSCRIBE")
    osc.createServer(ListenPort);
    setListener(eventEmitter.addListener('GotMessage', (oscMessage) => handleMessage(oscMessage)))
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