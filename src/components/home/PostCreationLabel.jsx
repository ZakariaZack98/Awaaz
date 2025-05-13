import React from "react";
import { _ } from "../../lib/lib";

const PostCreationLabel = () => {
  const iconsAndLabels = _.postCreationIconsAndLabels;
  return (
    <div className="flex flex-col p-3 rounded-2xl shadow-md bg-white">
      <div className="top flex items-center justify-between gap-x-2 pb-3 border-b border-gray-200">
        <picture className="w-10 h-10">
          <img
            src={
              //* currentUser.profile_picture
              null ||
              "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png"
            }
            className="w-10 h-10 rounded-full object-cover object-center"
          />
        </picture>
        <input
          type="text"
          placeholder={`What's on your mind?`}
          className="px-5 py-2 rounded-3xl focus:outline-0 bg-gray-100 w-9/10"
        />
      </div>
      <div className="bottom flex justify-between items-center px-3 pt-2 text-mainfontColor">
        {iconsAndLabels?.map((item) => (
          <div className="flex items-center gap-x-2 cursor-pointer hover:bg-gray-100 duration-200 rounded-md px-2 py-0.5">
            <span className={`text-3xl ${item.colorClass}`} >
              <item.icon />
            </span>
            <p className="font-semibold text-sm">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostCreationLabel;
