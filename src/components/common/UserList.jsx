import React from "react";
import UserCard from "./UserCard";

const UserList = ({ userListData, maxUser }) => {

  const maxUserListData = userListData?.slice(0, maxUser);

  return (
    <div className="rounded-xl">
      <div
        className="space-y-4 h-full overflow-y-scroll" style={{ scrollbarWidth: "none" }}>
        {maxUserListData?.map((userData) => (
          <UserCard key={userData.userId} singleUserData={userData} />
        ))}
      </div>
    </div>
  );
};

export default UserList;
