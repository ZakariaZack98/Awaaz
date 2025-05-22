import React, { useEffect, useState } from "react";
import Sidebar from "../components/common/Sidebar";
import { Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { DataProvider } from "../contexts/DataContexts";
import UserNotVerified from "./Error/UserNotVerified";
import { auth } from "../../Database/Firebase.config";

const CommonLayout = () => {
  const [userVerified, setUserVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserVerified(user.emailVerified);
      } else {
        setUserVerified(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <DataProvider>
      <div className="flex w-screen h-screen">
        {userVerified ? (
          <>
            <Sidebar />
            <div className="w-4/5 px-5 bg-[whitesmoke] text-mainfontColor">
              <Outlet />
            </div>
          </>
        ) : (
          <UserNotVerified />
        )}
      </div>
    </DataProvider>
  );
};

export default CommonLayout;
