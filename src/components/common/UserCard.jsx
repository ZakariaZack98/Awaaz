import React, { useEffect, useState } from "react";
import { CheckIfFollowed, Follow, Unfollow } from "../../utils/actions.utils";
import avatar from "../../assets/avatar.jpg";
import { useNavigate } from "react-router-dom";
import UserCardSkeleton from "../Skeleton/UserCardSkeleton";
import { auth } from "../../../Database/Firebase.config";
const UserCard = ({ singleUserData }) => {
  const { userId, username, fullName, imgUrl, isLocked } = singleUserData;
  const [isFollowed, setisFollowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    CheckIfFollowed(userId)
      .then((res) => setisFollowed(res))
      .catch(console.error);
  }, [userId, isFollowed]);

  if (!singleUserData) {
    return <UserCardSkeleton />;
  }

  return (
    <div className="flex items-center justify-between mb-3 mt-1" key={userId}>
      <div className="flex items-center gap-3">
        <picture>
          <img
            src={imgUrl == " " ? avatar : imgUrl}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        </picture>
        <div className="cursor-pointer" onClick={() => navigate(`/profile/${userId}`)}>
          <p className="text-sm font-semibold">{fullName}</p>
          <p className="text-xs text-gray-500">@{username}</p>
        </div>
      </div>
      {isLocked || singleUserData.userId === auth.currentUser.uid ? (
        ""
      ) : isFollowed ? (
        <button
          onClick={() => Unfollow(userId).then(() => setisFollowed(false))}
          className="text-xs font-semibold w-[55px] text-blue-500 cursor-pointer"
        >
          Unfollow
        </button>
      ) : (
        <button
          onClick={() => Follow(userId).then(() => setisFollowed(true))}
          className="text-xs font-semibold w-[55px] text-blue-500 cursor-pointer"
        >
          Follow
        </button>
      )}
    </div>
  );
};

export default UserCard;
