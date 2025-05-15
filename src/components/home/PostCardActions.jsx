import React from "react";
import { _ } from "../../lib/lib";

const PostCardActions = ({ postData }) => {
  const postCardActionMenu = _.postCardActions;
  return (
    <div className="w-50 border border-[rgba(0,0,0,0.12)] rounded-2xl bg-white overflow-hidden shadow-md">
      {postCardActionMenu?.map((option) => (
        <div key={option.label} className="flex justify-center items-center w-full border-b border-[rgba(0,0,0,0.12)] py-2 hover:bg-gray-200 duration-200 cursor-pointer">
          <p className={`text-sm font-medium ${option.colorClass}`}>{option.label}</p>
        </div>
      ))}
    </div>
  );
};

export default PostCardActions;
