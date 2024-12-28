import React, { useEffect } from 'react';
import { useAppContext } from './AppContext'

import osc from 'expo-osc';
import { NativeEventEmitter } from 'react-native';

const portOut = 2347;
const portIn = 2346;
const address = "10.1.2.16";

export function sendMsgs() {
  osc.sendMessage("/address/", ["foobar", 0.5]);
  osc.sendMessage("/address/", ["string value", 1, false, 0.5]);
}

export function sendOscMessage(address: string, data: (number | string)[]) {
  osc.sendMessage(address, data)
}

function OscHandler({ children }) {
  const { oscData, setOscData } = useAppContext()

  useEffect(() => {
    osc.createClient(address, portOut);
    osc.createServer(portIn);

    // create an event emitter sending the native osc module as parameter 
    // thank u https://bobbyhadz.com/blog/react-functional-component-add-event-listener
    const eventEmitter = new NativeEventEmitter(osc);

    const handleMessage = (oscMessage, oscData, setOscData) => {
      setOscData({
        ...oscData,
        [oscMessage.address]: oscMessage.data[0]
      })
      console.log("zmessage: ", oscMessage);
    };
    const listener = eventEmitter.addListener('GotMessage', (oscMessage) => handleMessage(oscMessage, oscData, setOscData));

    return () => {
      listener.remove()
    }
  }, []);

  return (<>{children}</>)
}

export default OscHandler