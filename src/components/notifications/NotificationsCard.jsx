import moment from "moment";
import React, { useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { BiSolidCommentDetail } from "react-icons/bi";
import { FaComment } from "react-icons/fa";
import { IoIosPersonAdd } from "react-icons/io";
import {
  handleRead,
  readNotificationUpdateDb,
} from "../../utils/notifications.utils";
import { useNavigate } from "react-router-dom";
import Post from "../../pages/Post/Post";

const NotificationsCard = ({ SingleNotificationData }) => {
  const {
    timestamp,
    type,
    triggererName,
    triggererImgUrl,
    data,
    postId,
    receiverId,
    triggererId,
    read,
    Key,
  } = SingleNotificationData;
  const [showPost, setShowPost] = useState(false);
  const navigate = useNavigate();
  // update
  if(!read) {
    readNotificationUpdateDb(receiverId, Key);
  }

  let message = "";
  let navigateTo = "";
  let icon = "";

  switch (type) {
    case "like":
      message = `${triggererName} has liked your post.`;
      icon = (
        <AiFillLike className="bg-blue-600 text-white rounded-full p-[3px] text-lg" />
      );
      break;

    case "comment":
      message = `${triggererName} has commented on your post - "${data}"`;
      icon = (
        <FaComment className="bg-purple-800 text-white rounded-full p-[3px] text-lg" />
      );
      break;

    case "likeOnComment":
      message = `${triggererName} likes your comment - "${data}"`;
      icon = (
        <AiFillLike className="bg-blue-600 text-white rounded-full p-[3px] text-lg" />
      );
      break;

    case "reply":
      message = `${triggererName} replied to your comment - "${data}"`;
      icon = (
        <BiSolidCommentDetail className="bg-purple-800 text-white rounded-full p-[3px] text-lg" />
      );
      break;

    case "likeOnReply":
      message = `${triggererName} likes your reply - "${data}"`;
      icon = (
        <AiFillLike className="bg-blue-600 text-white rounded-full p-[3px] text-lg" />
      );
      break;

    case "follow":
      message = `${triggererName} has started following you.`;
      navigateTo = `/profile/${triggererId}`;
      icon = (
        <IoIosPersonAdd className="bg-green-600 text-white rounded-full p-[3px] text-lg" />
      );
      break;
    default:
      message = "You have a new notification.";
  }


  return (
    <div
      onClick={() => {
        {
          showPost
            ? ""
            : type == "follow"
            ? handleRead(navigate, navigateTo)
            : setShowPost(true);`;`
        }
      }}
      className={`cursor-pointer flex items-center  p-2 justify-between mb-2 rounded `}
      key=""
    >
      {showPost && <Post setOpenPost={setShowPost} postId={postId} />}
      <div className="flex items-center gap-3 w-full pr-2">
        <picture className="relative">
          <img
            src={triggererImgUrl}
            alt="User Avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="absolute right-0 bottom-[2px]">{icon}</div>
        </picture>

        {/* text area */}
        <div className="w-[90%]">
          <p className="text-sm ">
            {message.split(" ").slice(0, 25).join(" ") +
              (message.length > 300 ? "..." : "")}
          </p>
          <p className="text-xs font-normal text-gray-500">
            {moment(timestamp).fromNow()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationsCard;
