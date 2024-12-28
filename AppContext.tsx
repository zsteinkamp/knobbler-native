import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null)

function AppContextProvider({ children }) {
  const [oscData, setOscData] = useState({})
  const [renderFlag, setRenderFlag] = useState(false)

  return (
    <AppContext.Provider value={{ oscData, setOscData, renderFlag, setRenderFlag }}>
      {children}
    </AppContext.Provider>
  );
}

function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('Trying to acess MyContext out of the Provider');
  }

  return context;
};

export { useAppContext }
export default AppContextProvider