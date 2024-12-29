import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from './AppContext'
import osc from 'expo-osc';
import { NativeEventEmitter } from 'react-native';

export function sendOscMessage(address: string, data: OscMessageData) {
  osc.sendMessage(address, data)
}

const eventEmitter = new NativeEventEmitter(osc);

function OscHandler({ children }) {
  const { setOscData, oscDataRef, sliderRefsRef } = useAppContext()
  const [listener, setListener] = useState(null)

  const handleMessage = (oscMessage: OscMessage) => {
    const address = oscMessage.address
    const value = oscMessage.data[0]

    // simplify for now
    if (address.match(/^\/[c]/)) {
      return
    }

    //console.log('GOT', oscMessage)

    // straight to the ref instead of setOscData() from useState
    // thx https://medium.com/geographit/accessing-react-state-in-event-listeners-with-usestate-and-useref-hooks-8cceee73c559
    oscDataRef.current[address] = value

    if (sliderRefsRef.current[address]) {
      sliderRefsRef.current[address].current?.setValueQuietly(value)
    }

    setOscData({ ...oscDataRef.current })
  }

  const _subscribe = () => {
    const ListenPort = 2347;
    const PeerHost = "10.1.2.16";
    const PeerPort = 2346;

    osc.createClient(PeerHost, PeerPort);
    osc.createServer(ListenPort);
    setListener(eventEmitter.addListener('GotMessage', handleMessage))
  }
  const _unsubscribe = () => {
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