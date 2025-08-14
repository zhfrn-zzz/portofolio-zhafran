import React, { createContext, useContext, useState } from 'react';

const WelcomeContext = createContext();

export const useWelcome = () => {
  const context = useContext(WelcomeContext);
  if (!context) {
    throw new Error('useWelcome must be used within a WelcomeProvider');
  }
  return context;
};

export const WelcomeProvider = ({ children }) => {
  const [isWelcomeActive, setIsWelcomeActive] = useState(true);
  
  return (
    <WelcomeContext.Provider value={{ 
      isWelcomeActive, 
      setIsWelcomeActive 
    }}>
      {children}
    </WelcomeContext.Provider>
  );
};
