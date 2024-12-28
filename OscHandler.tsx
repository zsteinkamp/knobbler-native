import React, { useEffect } from 'react';
import { useAppContext } from './AppContext'

import osc from 'expo-osc';
import { NativeEventEmitter } from 'react-native';

const ListenPort = 2347;
const PeerHost = "10.1.2.16";
const PeerPort = 2346;

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

function OscHandler({ children }) {
  const { oscData, setOscData, renderFlag, setRenderFlag } = useAppContext()

  const pendingMessages = []

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

  useEffect(() => {
    osc.createClient(PeerHost, PeerPort);
    osc.createServer(ListenPort);

    // create an event emitter sending the native osc module as parameter 
    // thank u https://bobbyhadz.com/blog/react-functional-component-add-event-listener
    const eventEmitter = new NativeEventEmitter(osc);

    const handleMessage = (oscMessage: OscMessage) => {
      pendingMessages.push(oscMessage)
      setRenderFlag(!renderFlag)
    }

    const listener = eventEmitter.addListener('GotMessage', (oscMessage) => handleMessage(oscMessage));

    return () => {
      processMessages()
      listener.remove()
    }
  });

  return (<>{children}</>)
}

export default OscHandler