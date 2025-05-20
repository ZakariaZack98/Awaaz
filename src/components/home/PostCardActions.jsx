import React, { useEffect, useState } from "react";
import { DeletePost, Follow, RemoveSavedPost, SavePost, TogglePostVisibility, Unfollow } from "../../utils/actions.utils";
import { auth, db } from "../../../Database/Firebase.config";
import { get, ref } from "firebase/database";

const PostCardActions = ({ postData, setOpenPostActions, saved, setSaved, followed, setFollowed }) => {
  const [visibility, setVisibility] = useState('public')

  useEffect(() => {
    const visibilityRef = ref(db, `posts/${postData.id}/visibility`);
    get(visibilityRef)
    .then(value => setVisibility(value.val()))
    .catch(console.error)
  }, [])


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
      {
        postData.posterId !== auth.currentUser.uid ? (
          <>
            <div className="flex justify-center items-center w-full border-b border-[rgba(0,0,0,0.12)] py-2 hover:bg-gray-200 duration-200 cursor-pointer" onClick={() => handleFollow()}>
              <p className={`text-sm font-medium  ${followed ? 'text-red-500' : ''}`}>{followed ? 'Unfollow' : 'Follow'}</p>
            </div>
            <div className="flex justify-center items-center w-full border-b border-[rgba(0,0,0,0.12)] py-2 hover:bg-gray-200 duration-200 cursor-pointer" onClick={() => handleSave()}>
              <p className={`text-sm font-medium  ${saved ? 'text-red-500' : ''}`}>{saved ? 'Remove from saved' : 'Save post'}</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center items-center w-full border-b border-[rgba(0,0,0,0.12)] py-2 hover:bg-gray-200 duration-200 cursor-pointer" onClick={() => DeletePost(postData.id)}>
              <p className={`text-sm font-medium text-red-500`}>Delete post</p>
            </div>
            <div className="flex justify-center items-center w-full border-b border-[rgba(0,0,0,0.12)] py-2 hover:bg-gray-200 duration-200 cursor-pointer" onClick={() => TogglePostVisibility(visibility, setVisibility, postData.id)}>
              <p className={`text-sm font-medium  ${visibility === 'public' ? 'text-red-500' : 'text-green-500'}`}>{visibility === 'public' ? 'Make post private' : 'Make post public'}</p>
            </div>
          </>
        )
      }
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
