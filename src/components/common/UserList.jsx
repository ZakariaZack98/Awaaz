import React, { useEffect, useState } from "react";
import avatar from "../../assets/avatar.jpg";
import { CheckIfFollowed, Follow, Unfollow } from "../../utils/actions.utils";

const UserList = ({ UserData }) => {
    const [isFollowed, setIsFollowed] = useState({});



    // ToDo: store [uid]: true/false in state in a object
    useEffect(() => {
        const check = async () => {
            const followedStatus = {};
            for (const user of UserData) {
                const followed = await CheckIfFollowed(user.userId);
                followedStatus[user.userId] = followed;
            }
            setIsFollowed(followedStatus);
        };
        check()
    }, [UserData]);

    // handleFollow
    // ! update realtime state value only. If there is any error to update database, this time also upadte state value. moral is state value is manupulate by click.
    const handleFollow = async (userId) => {
        await Follow(userId)
        setIsFollowed((prev) => ({ ...prev, [userId]: true }));
    };
    //  handleUnfollow
    const handleUnfollow = async (userId) => {
        await Unfollow(userId);
        setIsFollowed((prev) => ({ ...prev, [userId]: false }));
    };
    return (
        <div>
            {UserData?.map(({ fullName, imgUrl, username, userId, isLocked }, index) => (
                <div className="flex items-center justify-between" key={index}>
                    <div className="flex items-center gap-3">
                        <picture>
                            <img
                                src={imgUrl !== " " ? imgUrl : avatar}
                                alt="Image Missing"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        </picture>
                        <div>
                            <p className="text-sm font-semibold">{fullName}</p>
                            <p className="text-xs text-gray-500">{username}</p>
                        </div>
                    </div>
                    {isFollowed[userId] ? (
                        <button
                            onClick={() => handleUnfollow(userId)}
                            className="text-sm text-blue-500 rounded font-semibold cursor-pointer"
                        >
                            UnFollow
                        </button>
                    ) : isLocked ? (
                        ""
                    ) : (
                        <button
                            onClick={() => handleFollow(userId)}
                            className="text-sm text-blue-500 rounded font-semibold cursor-pointer"
                        >
                            Follow
                        </button>
                    )}
                </div>
            ))
            }
        </div>


    );
};

export default UserList;
