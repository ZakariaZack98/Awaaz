import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { db } from "../../../Database/Firebase.config";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("data from all", data);

        const usersArray = Object.entries(data).map(([userId, user]) => ({
          userId,
          ...user,
        }));
        setUsers(usersArray);
      }
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4"> All Users</h2>
      <div className="grid grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user.userId}
            onClick={() => navigate(`/profile/${user.userId}`)}
            className="cursor-pointer border p-4 rounded hover:bg-gray-100"
          >
            <img
              src={user.imgUrl || "https://via.placeholder.com/100"}
              alt={user.username}
              className="w-24 h-24 rounded-full object-cover mx-auto"
            />
            <h3 className="text-center mt-2 font-semibold">
              {user.fullName || user.username}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
