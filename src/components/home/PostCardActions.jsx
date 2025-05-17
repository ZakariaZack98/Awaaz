import React from "react";
import { Follow, RemoveSavedPost, SavePost, Unfollow } from "../../utils/actions.utils";

const PostCardActions = ({ postData, setOpenPostActions, saved, setSaved, followed, setFollowed }) => {
  // TODO: HANDLE FOLLOW/UNFOLLOW ==============================
  const handleFollow = async () => {
    setFollowed(followed ? false : true);
    followed ? await Unfollow(postData.posterId) : Follow(postData.posterId)
    setOpenPostActions(false);
  }

  // TODO: HANDLE POST SAVE ====================================
  const handleSave = async () => {
    setSaved(saved ? false : true);
    saved ? await RemoveSavedPost(postData.id) : await SavePost(postData.id)
    setOpenPostActions(false);
  };

  return (
    <div className="w-50 border border-[rgba(0,0,0,0.12)] rounded-2xl bg-white overflow-hidden shadow-md">
      <div className="flex justify-center items-center w-full border-b border-[rgba(0,0,0,0.12)] py-2 hover:bg-gray-200 duration-200 cursor-pointer" onClick={() => handleFollow()}>
        <p className={`text-sm font-medium  ${followed ? 'text-red-500' : ''}`}>{followed ? 'Unfollow' : 'Follow'}</p>
      </div>
      <div className="flex justify-center items-center w-full border-b border-[rgba(0,0,0,0.12)] py-2 hover:bg-gray-200 duration-200 cursor-pointer" onClick={() => handleSave()}>
        <p className={`text-sm font-medium  ${saved ? 'text-red-500' : ''}`}>{saved ? 'Remove from saved' : 'Save post'}</p>
      </div>
      {/* Open post page when clicked */}
      <div className="flex justify-center items-center w-full border-b border-[rgba(0,0,0,0.12)] py-2 hover:bg-gray-200 duration-200 cursor-pointer">
        <p className={`text-sm font-medium `}>Go to post</p>
      </div>
      <div className="flex justify-center items-center w-full border-b border-[rgba(0,0,0,0.12)] py-2 hover:bg-gray-200 duration-200 cursor-pointer">
        <p className={`text-sm font-medium `}>Share</p>
      </div>
      {/* Take to the poster's account */}
      <div className="flex justify-center items-center w-full border-b border-[rgba(0,0,0,0.12)] py-2 hover:bg-gray-200 duration-200 cursor-pointer">
        <p className={`text-sm font-medium `}>About this account</p>
      </div>
      <div className="flex justify-center items-center w-full border-b border-[rgba(0,0,0,0.12)] py-2 hover:bg-gray-200 duration-200 cursor-pointer text-blue-600" onClick={() => setOpenPostActions(false)}>
        <p className={`text-sm font-medium `}>Close</p>
      </div>
    </div>
  );
};

export default PostCardActions;
