import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../contexts/DataContexts";
import UserList from "../../components/common/UserList";
import { onValue, ref } from "firebase/database";
import { auth, db } from "../../../Database/Firebase.config";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import PeopleSuggestionSkeleton from "../../components/Skeleton/PeopleSuggestionSkeleton";

const PeopleSuggestion = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(DataContext);
  const [userData, setUserData] = useState();

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        navigate("signin");
        console.log("User signed out.");
      })
      .catch((error) => {
        console.error("Sign-out error:", error);
      });
  };

  useEffect(() => {
    const usersRef = ref(db, "users/");
    onValue(usersRef, (snapshot) => {
      const userArr = [];
      snapshot.forEach((userSnapshot) => {
        if (userSnapshot.key !== auth.currentUser.uid) {
          userArr.push(userSnapshot.val());
        }
      });
      setUserData(userArr);
    });
  }, []);

  return (
    <>
      {!userData ? (<PeopleSuggestionSkeleton />) : 
      (<div className=" w-[70%] p-4 h-screen bg-white shadow rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.imgUrl} // Your profile image
              alt="profile"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-bold text-gray- 800">
                {currentUser?.fullName}
              </p>
              <p className="text-xs text-gray-500">{currentUser?.fullName}</p>
            </div>
          </div>
          <button
            onClick={() => handleLogOut()}
            className="text-sm text-blue-500 font-semibold"
          >
            LogOut
          </button>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-gray-500">Suggested for you</p>
          <button className="text-xs text-blue-500 font-semibold">See All</button>
        </div>
        {/* UserCard Component */}
        <UserList userListData={userData} />
        {/* UserCard Component */}

        <footer className=" text-[10px] text-gray-400">
          <p className="pt-2">© 2025 Awaaz</p>
        </footer>
      </div>)
      }
    </>
  );
};

export default PeopleSuggestion;
