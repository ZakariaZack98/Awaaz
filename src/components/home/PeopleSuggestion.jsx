import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../contexts/DataContexts";
import UserList from "../../components/common/UserList";
import { get, ref } from "firebase/database";
import { auth, db } from "../../../Database/Firebase.config";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import PeopleSuggestionSkeleton from "../../components/Skeleton/PeopleSuggestionSkeleton";
import { toast } from "react-toastify";

const PeopleSuggestion = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(DataContext);
  const [userData, setUserData] = useState();
  const [maxUser, setMaxUser] = useState(15)
  const [expendedData, setExpendedData] = useState(true)

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        toast.success("SignOut succesfully");
        navigate("signin");
      })
      .catch((error) => {
        console.error("Sign-out error:", error);
      });
  };

  useEffect(() => {
    const usersRef = ref(db, "users/");
    get(usersRef).then((snapshot) => {
      const userArr = [];
      snapshot.forEach((userSnapshot) => {
        if (userSnapshot.key !== auth.currentUser.uid) {
          userArr.push(userSnapshot.val());
        }
      });
      setUserData(userArr);
    }).catch(console.error);
  }, []);

  const handleSeeMore = () => {
    if (expendedData) {
      setMaxUser(15)
    }
    else {
      setMaxUser(userData.length)
    }
    setExpendedData(!expendedData)
  }
  // console.log(expendedData);

  return (
    <>
      {!userData ? (<PeopleSuggestionSkeleton />) :
        (<div className="max-w-100 p-4 h-[90dvh] rounded-xl space-y-4">
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
            <button onClick={() => handleSeeMore()} className="text-xs text-blue-500 font-semibold cursor-pointer">{expendedData ? "See Less" : "See More"}</button>
          </div>
          {/* UserCard Component */}
          <UserList userListData={userData} maxUser={maxUser} />
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
