import React, { useEffect, useState } from 'react';
import { useAppContext } from './AppContext'
import osc from 'expo-osc';
import { NativeEventEmitter } from 'react-native';
import { RETAIN_OSC_MSG_COUNT } from './lib/constants';

export function OscSend(collectOsc, lastOscSentRef, setLastOscSent, address: string, data?: OscMessageData) {
  //console.log('OSC_SEND', { collectOsc, lastOscSentRef: lastOscSentRef?.current })
  if (collectOsc && lastOscSentRef?.current) {
    lastOscSentRef.current.unshift([
      address,
      (typeof (data) != "undefined") ? data[0] : null
    ].join(" "))
    //console.log('NEWSENT', lastOscSentRef.current.slice(0, 10))
    setLastOscSent(lastOscSentRef.current.slice(0, RETAIN_OSC_MSG_COUNT))
  }

  if (data) {
    osc.sendMessage(address, data)
  } else {
    osc.sendMessage(address)
  }
}

const eventEmitter = new NativeEventEmitter(osc);

function OscHandler({ children }) {
  const { oscDataRef, sliderRefsRef, lastOscReceivedRef, setLastOscReceived, serverHost, serverPort, listenPort, collectOsc, setRenderTimestamp } = useAppContext()
  const [listener, setListener] = useState(null)

  // variables to debounce the render timestamp flag
  let renderTimer = null
  const updateFreq = 10

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
    // not using state for this -- just jam it in the ref and then
    //setOscData({ ...oscDataRef.current })

    if (sliderRefsRef.current[address]) {
      sliderRefsRef.current[address].current?.setValueQuietly(value)
    }

    // updated received msgs list
    if (collectOsc && lastOscReceivedRef?.current?.unshift) {
      lastOscReceivedRef.current.unshift([address, value].join(" "))
      setLastOscReceived(lastOscReceivedRef.current.slice(0, RETAIN_OSC_MSG_COUNT))
    }

    // debounce to update the UI, decoupled from each message received Waits for
    // a 1ms lull before recomputing the ui. Seems to make a huge difference.
    if (renderTimer) {
      clearTimeout(renderTimer)
    }
    renderTimer = setTimeout(
      () => setRenderTimestamp((new Date()).getTime()),
      updateFreq
    )
  }

  useEffect(() => {
    if (!serverHost || !serverPort) {
      if (listener) {
        // zero out the connection
        listener.remove();
        setListener(null);
      }
      return
    }
    // subscribe
    //console.log('SUBSCRIBE', { serverHost, serverPort, collectOsc })
    osc.createClient(serverHost, serverPort);
    osc.createServer(listenPort);
    setListener(eventEmitter.addListener('GotMessage', handleMessage))
    return () => {
      // unsubscribe
      //console.log('UN-SUBSCRIBE', { listener, serverHost, serverPort })
      listener && listener.remove();
      setListener(null);
    }
  }, [serverHost, serverPort, collectOsc]);

  return (<>{children}</>)
}

export default OscHandler