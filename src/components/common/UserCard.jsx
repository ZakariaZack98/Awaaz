import React, { useEffect, useState } from "react";
import { CheckIfFollowed, Follow, Unfollow } from "../../utils/actions.utils";
import avatar from "../../assets/avatar.jpg";
const UserCard = ({ singleUserData }) => {
  const { userId, username, fullName, imgUrl, isLocked } = singleUserData;
  const [isFollowed, setisFollowed] = useState(false);

  useEffect(() => {
    CheckIfFollowed(userId)
      .then((res) => setisFollowed(res))
      .catch(console.error);
  }, [userId, isFollowed]);

  return (
    <div className="flex items-center justify-between mb-2" key={userId}>
      <div className="flex items-center gap-3">
        <picture>
          <img
            src={imgUrl == " " ? avatar : imgUrl}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        </picture>
        <div>
          <p className="text-sm font-semibold">{fullName}</p>
          <p className="text-xs text-gray-500">@{username}</p>
        </div>
      </div>
      {isLocked ? (
        ""
      ) : isFollowed ? (
        <button
          onClick={() => Unfollow(userId).then(() => setisFollowed(false))}
          className="text-xs font-semibold text-blue-500 cursor-pointer"
        >
          Unfollow
        </button>
      ) : (
        <button
          onClick={() => Follow(userId).then(() => setisFollowed(true))}
          className="text-xs font-semibold text-blue-500 cursor-pointer"
        >
          Follow
        </button>
      )}
    </div>
  );
};

export default UserCard;
