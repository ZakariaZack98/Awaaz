import React, { createContext, useState } from "react";

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {

  const [currentUser, setCurrentUser] = useState(null);
  const [notificationsData, setNotificationsData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [feedData, setFeedData] = useState(null);

  const contextValue = {
    currentUser,
    setCurrentUser,
    notificationsData,
    setNotificationsData,
    userData, 
    setUserData,
    feedData, 
    setFeedData
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};
