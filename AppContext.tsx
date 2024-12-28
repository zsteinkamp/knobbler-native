import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null)

function AppContextProvider({ children }) {
  const [oscData, setOscData] = useState({})

  return (
    <AppContext.Provider value={{ oscData, setOscData }}>
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

export { AppContextProvider, useAppContext }