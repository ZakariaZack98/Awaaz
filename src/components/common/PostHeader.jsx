import React from "react";
import PostCardActions from "../home/PostCardActions";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const PostHeader = ({ postData, openPostActions, setOpenPostActions, followed, setFollowed, saved, setSaved }) => {
  const { posterImgUrl, posterName, posterId, posterUsername, createdAt } = postData;
  const navigate = useNavigate();
  return (
      <div className="header flex justify-between items-center pb-3">
        <div className="flex items-center gap-x-2 cursor-pointer">
          <img
            src={
              posterImgUrl ||
              "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
            }
            className="rounded-full w-10 h-10"
          />
          <div className="flex items-baseline gap-x-2">
            <div className="flex flex-col" onClick={() => navigate(`/profile/${posterId}`)}>
              <p className="text-sm font-semibold leading-3">{posterName || "Name Missing"}</p>
              <p className="opacity-70 text-[13px]">{posterUsername ? `@${posterUsername}` : "@username"}</p>
            </div>
            <span>
              <GoDotFill className="translate-y-1"/>
            </span>
            <p className="opacity-70 text-[13px]">{moment(createdAt).fromNow()}</p>
          </div>
        </div>
        <span className="relative">
          <BsThreeDotsVertical className="cursor-pointer" onClick={() => setOpenPostActions((prev) => !prev)} />
          {openPostActions && (
            <div className="absolute right-0 top-5 z-50">
              <PostCardActions
                postData={postData}
                setOpenPostActions={setOpenPostActions}
                saved={saved}
                setSaved={setSaved}
                followed={followed}
                setFollowed={setFollowed}
              />
            </div>
          )}
        </span>
      </div>
  );
};

export default PostHeader;
