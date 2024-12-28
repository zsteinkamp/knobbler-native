import React, { useEffect } from 'react';
import { useAppContext } from './AppContext'

import osc from 'expo-osc';
import { NativeEventEmitter } from 'react-native';

const PortOut = 2347;
const PortIn = 2346;
const ServerHost = "10.1.2.16";

export function sendMsgs() {
  osc.sendMessage("/address/", ["foobar", 0.5]);
  osc.sendMessage("/address/", ["string value", 1, false, 0.5]);
}

type OscMessageData = (number | string)[]

export function sendOscMessage(address: string, data: OscMessageData) {
  osc.sendMessage(address, data)
}

function OscHandler({ children }) {
  const { oscData, setOscData } = useAppContext()

  useEffect(() => {
    osc.createClient(ServerHost, PortOut);
    osc.createServer(PortIn);

    // create an event emitter sending the native osc module as parameter 
    // thank u https://bobbyhadz.com/blog/react-functional-component-add-event-listener
    const eventEmitter = new NativeEventEmitter(osc);

    const handleMessage = (oscMessage) => {
      setOscData({
        ...oscData,
        [oscMessage.address]: oscMessage.data[0]
      })
      console.log("zmessage: ", oscMessage);
    };

    const listener = eventEmitter.addListener('GotMessage', (oscMessage) => handleMessage(oscMessage));

    return () => {
      listener.remove()
    }
  }, [oscData, setOscData]);

  return (<>{children}</>)
}

export default OscHandler