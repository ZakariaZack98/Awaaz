import moment from "moment";
import React, { useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { BiSolidCommentCheck, BiSolidCommentDetail } from "react-icons/bi";
import { FaComment } from "react-icons/fa";
import { IoIosPersonAdd } from "react-icons/io";
import { TbFileLike } from "react-icons/tb";
import { handleRead } from "../../utils/notifications.utils";
import { useNavigate } from "react-router-dom";

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
  const [readDone, setReadDone] = useState(read);
  const navigate = useNavigate()
  console.log(Key);
  console.log(receiverId);

  let message = "";
  let navigateTo = "";
  let icon = "";

  switch (type) {
    case "like":
      message = `${triggererName} has liked your post.`;
      navigateTo = `/post/${postId}`;
      icon = (
        <AiFillLike className="bg-blue-600 text-white rounded-full p-[3px] text-lg" />
      );
      break;

    case "comment":
      message = `${triggererName} has commented on your post - "${data}"`;
      navigateTo = `/post/${postId}`;
      icon = (
        <FaComment className="bg-green-600 text-white rounded-full p-[3px] text-lg" />
      );
      break;

    case "likeOnComment":
      message = `${triggererName} likes your comment - "${data}"`;
      navigateTo = `/post/${postId}`;
      icon = (
        <BiSolidCommentCheck className="bg-blue-600 text-white rounded-full p-[3px] text-lg" />
      );
      break;

    case "reply":
      message = `${triggererName} replied to your comment - "${data}"`;
      navigateTo = `/post/${postId}`;
      icon = (
        <BiSolidCommentDetail className="bg-green-600 text-white rounded-full p-[3px] text-lg" />
      );
      break;

    case "likeOnReply":
      message = `${triggererName} likes your reply - "${data}"`;
      navigateTo = `/post/${postId}`;
      icon = (
        <TbFileLike className="bg-red-600 text-white rounded-full p-[3px] text-lg" />
      );
      break;

    case "follow":
      message = `${triggererName} has started following you.`;
      navigateTo = `/profile/${triggererId}`;
      icon = (
        <IoIosPersonAdd className="bg-red-600 text-white rounded-full p-[3px] text-lg" />
      );
      break;
    default:
      message = "You have a new notification.";
      navigateTo = "/";
  }

 
  return (
    <div
      onClick={() => handleRead(receiverId,Key,setReadDone,navigate,navigateTo)}
      className={`cursor-pointer flex items-center w-[80%] p-2 justify-between mb-2 border-1 border-gray-200 rounded shadow-2xs ${
        readDone ? "bg-gray-100" : "bg-gray-200 font-bold"
      }`}
      key=""
    >
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
