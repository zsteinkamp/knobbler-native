import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

// thank u https://thelinuxcode.com/react-context-for-beginners-the-complete-guide-2023/
const AppContext = createContext(null)

function AppContextProvider({ children }) {
  const [oscData, setOscData] = useState({})
  const [sliderRefs, setSliderRefs] = useState({})
  const [lastOscReceived, setLastOscReceived] = useState([])
  const [lastOscSent, setLastOscSent] = useState([])
  const [collectOsc, setCollectOsc] = useState(false)
  const [listenPort, setListenPort] = useState(2347)

  const sliderRefsRef = useRef(sliderRefs)
  const oscDataRef = useRef(oscData)
  const lastOscReceivedRef = useRef(lastOscReceived)
  const lastOscSentRef = useRef(lastOscSent)

  const dataFetch = async (key: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      //console.log(`Read key ${key} got ${jsonValue}`)
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
      console.error('Error reading `' + key + '`', e)
    }
  }

  const dataStore = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
      //console.log(`Saved key ${key} value ${await AsyncStorage.getItem(key)}`)
    } catch (e) {
      // saving error
      console.error('Error saving `' + key + '` ' + JSON.stringify(data), e)
    }
  }

  const [serverHost, _setServerHost] = useState("") // _setServerHost gets wrapped by setServerHost below
  const [serverPort, _setServerPort] = useState(null) // _setServerPort gets wrapped by setServerPort below

  useEffect(() => {
    // init vals from AsyncStorage
    if (!serverHost) {
      dataFetch('serverHost').then((val) => _setServerHost(val))
    }
    if (!serverPort) {
      dataFetch('serverPort').then((val) => _setServerPort(val))
    }
  })

  const setServerHost = async (val: string) => {
    dataStore('serverHost', val)
    _setServerHost(val)
  }
  const setServerPort = async (val: string) => {
    const intVal = val ? parseInt(val) : null
    dataStore('serverPort', intVal)
    _setServerPort(intVal)
  }

  return (
    <AppContext.Provider value={{
      oscData, setOscData, oscDataRef,
      sliderRefs, setSliderRefs, sliderRefsRef,
      lastOscReceived, setLastOscReceived, lastOscReceivedRef,
      lastOscSent, setLastOscSent, lastOscSentRef,
      serverHost, setServerHost,
      serverPort, setServerPort,
      collectOsc, setCollectOsc,
      listenPort, setListenPort,
      dataFetch, dataStore,
    }}>
      {children}
    </AppContext.Provider>
  );
}

function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('Trying to access MyContext out of the Provider');
  }

  return context;
};

export { useAppContext }
export default AppContextProvider