import React from "react";
import UserCard from "./UserCard";

const UserList = ({ userListData }) => {

  return (
    <div className=" h-[75%] rounded-xl">
      <div
        className="space-y-4 h-full overflow-y-scroll" style={{ scrollbarWidth: "none" }}>
        {userListData?.map((userData) => (
          <UserCard singleUserData={userData} />
        ))}
      </div>
    </div>
  );
};

export default UserList;
