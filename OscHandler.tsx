import React, { useEffect } from 'react';
import { useAppContext } from './AppContext'

import osc from 'expo-osc';
import { NativeEventEmitter } from 'react-native';

const ListenPort = 2347;
const PeerHost = "10.1.2.16";
const PeerPort = 2346;

osc.createClient(PeerHost, PeerPort);
osc.createServer(ListenPort);

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
let listener = null

function OscHandler({ children }) {
  const { oscData, setOscData } = useAppContext()

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
    pendingMessages.push(oscMessage)
  }
  if (!listener) {
    listener = eventEmitter.addListener('GotMessage', (oscMessage) => handleMessage(oscMessage));
  }

  useEffect(() => {
    return () => {
      processMessages()
      //listener.remove()
    }
  });

  return (<>{children}</>)
}

export default OscHandler