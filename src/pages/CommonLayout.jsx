import React, { useEffect, useState } from "react";
import Sidebar from "../components/common/Sidebar";
import { Outlet } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { DataProvider } from "../contexts/DataContexts";
import UserNotVerified from "./Error/UserNotVerified";

const CommonLayout = () => {
  const auth = getAuth();
  const [userVerified, setuserVerifed] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setuserVerifed(user.emailVerified);
    });
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
