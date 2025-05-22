import React, { createContext, useState } from "react";

// Create context outside of any function component
export const DataContext = createContext(null);

// Create provider as a proper function component
export const DataProvider = ({ children }) => {
  // Hooks must be called inside function components
  const [currentUser, setCurrentUser] = useState(null);
  const [notificationsData, setNotificationsData] = useState(null);
  const [userData, setUserData] = useState(null);

  // Create value object
  const contextValue = {
    currentUser,
    setCurrentUser,
    notificationsData,
    setNotificationsData,
    userData, 
    setUserData
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};
