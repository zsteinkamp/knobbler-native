import React, { useEffect, useState } from 'react';
import { useAppContext } from './AppContext'
import osc from 'expo-osc';
import { NativeEventEmitter } from 'react-native';
import { RETAIN_OSC_MSG_COUNT } from './lib/constants';

export function OscSender(lastOscSent, setLastOscSent) {
  return {
    send: (address: string, data?: OscMessageData) => {
      const newSent = [...lastOscSent]
      newSent.push([
        address,
        (typeof (data) != "undefined") ? data[0] : null
      ].join(" "))
      setLastOscSent(newSent.slice(-RETAIN_OSC_MSG_COUNT))

      if (data) {
        osc.sendMessage(address, data)
      } else {
        osc.sendMessage(address)
      }
    }
  }
}

const eventEmitter = new NativeEventEmitter(osc);

function OscHandler({ children }) {
  const { setOscData, oscDataRef, sliderRefsRef, lastOscReceivedRef, setLastOscReceived } = useAppContext()
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

    // updated received msgs list
    if (lastOscReceivedRef?.current?.push) {
      lastOscReceivedRef.current.push([address, value].join(" "))
      setLastOscReceived(lastOscReceivedRef.current.slice(-RETAIN_OSC_MSG_COUNT))
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