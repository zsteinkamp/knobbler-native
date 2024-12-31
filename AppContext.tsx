import React, { createContext, useContext, useRef, useState } from 'react';

// thank u https://thelinuxcode.com/react-context-for-beginners-the-complete-guide-2023/
const AppContext = createContext(null)

function AppContextProvider({ children }) {
  const [oscData, setOscData] = useState({})
  const [sliderRefs, setSliderRefs] = useState({})
  const [lastOscReceived, setLastOscReceived] = useState([])
  const [lastOscSent, setLastOscSent] = useState([])
  const [serverHost, setServerHost] = useState("")
  const [serverPort, setServerPort] = useState(null)

  const sliderRefsRef = useRef(sliderRefs)
  const oscDataRef = useRef(oscData)
  const lastOscReceivedRef = useRef(lastOscReceived)

  return (
    <AppContext.Provider value={{
      oscData, setOscData, oscDataRef,
      sliderRefs, setSliderRefs, sliderRefsRef,
      lastOscReceived, setLastOscReceived, lastOscReceivedRef,
      lastOscSent, setLastOscSent,
      serverHost, setServerHost,
      serverPort, setServerPort,
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