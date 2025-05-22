import React, { createContext, useState } from "react";
const DataContext = createContext();
const DataProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [notificationsData, setNotificationsData] = useState(null);
  const [userData, setUserData] = useState(null);
 
  return (
    <DataContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        notificationsData,
        setNotificationsData,
        userData,
        setUserData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };
