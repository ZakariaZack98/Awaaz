import React from "react";
import PostCardActions from "../home/PostCardActions";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import moment from "moment";

const PostHeader = ({ postData, openPostActions, setOpenPostActions, followed, setFollowed, saved, setSaved }) => {
  const { posterImgUrl, posterName, posterUsername, createdAt } = postData;
  return (
    <div>
      <div className="header flex justify-between items-center pb-2">
        <div className="flex items-center gap-x-2 cursor-pointer">
          <img
            src={
              posterImgUrl ||
              "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
            }
            className="rounded-full w-10 h-10"
          />
          <div className="flex items-start gap-x-2">
            <div className="flex flex-col">
              <p className="text-sm font-semibold">{posterName || "Name Missing"}</p>
              <p className="opacity-70 text-[13px]">{posterUsername ? `@${posterUsername}` : "@username"}</p>
            </div>
            <span>
              <GoDotFill />
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
    </div>
  );
};

export default PostHeader;
