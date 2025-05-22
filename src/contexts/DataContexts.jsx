import React, { createContext, useState } from "react";
export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [notificationsData, setNotificationsData] = useState(null);
  
  const contextValue = {
    currentUser,
    setCurrentUser,
    notificationsData, 
    setNotificationsData,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};
