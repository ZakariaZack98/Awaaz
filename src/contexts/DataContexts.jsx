import React, { createContext, useState } from 'react';
export const DataContext = createContext();
export const DataProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <DataContext.Provider value={{currentUser, setCurrentUser}}>
      {children}
    </DataContext.Provider>
  );
};
