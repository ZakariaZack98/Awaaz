import React, { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import ImageSlider from "../common/ImageSlider";
import PostCardActions from "./PostCardActions";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { IoChatbubbleOutline } from "react-icons/io5";
import { PiPaperPlaneTilt } from "react-icons/pi";
import { CiFaceSmile } from "react-icons/ci";
import EmojiPicker from 'emoji-picker-react';
import { auth } from "../../../Database/Firebase.config";

const PostCard = () => {
  // const {id, text, poseterId, posterName, posterImgUrl, createdAt, imgUrls, videoUrl, likeCounts} = postData;
  const [openPostActions, setOpenPostActions] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(12);
  const [commentsCount, setCommentsCount] = useState(28);
  const [comment, setComment] = useState('');
  const [displayComment, setDisplayComment] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  // TODO: CLOSE EMOJI PICKER WHEN CLICKED OUTSIDE ==============
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEmojiClick = (emojiObject) => {
    setComment(prevComment => prevComment + emojiObject.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(prev => !prev);
  };

  // TODO: DISPLAY COMMENT ON POSTCARD & POST COMMENT TO POST DB
  const handleComment = (comment, postId) => {
    setDisplayComment(comment);
    setComment('');
    setCommentsCount(commentsCount + 1)
    //* comment post function here
  }

  // TODO: HANDLE POST LIKE ====================================
  const handleLike = postId => {
    setLiked(prev => !prev);
    //* like post function here
  }
  // TODO: HANDLE POST SAVE ====================================
  const handleSave = postId => {
    setSaved(prev => !prev);
    //* save post function here
  }

  return (
    //================ HEADING ======================//
    <div className="p-3 bg-white rounded-md shadow-md">
      <div className="header flex justify-between items-center pb-2">
        <div className="flex items-center gap-x-2 cursor-pointer">
          <img
            src={
              "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
            }
            alt={""}
            className="rounded-full w-10 h-10"
          />
          <div className="flex items-start gap-x-2">
            <div className="flex flex-col">
              <p className="text-sm font-semibold">{"Sadee Muhammad Zakaria"}</p>
              <p className="opacity-70 text-[13px]">{"@username"}</p>
            </div>
            <span>
              <GoDotFill />
            </span>
            <p className="opacity-70 text-[13px]">{"2 hours ago"}</p>
          </div>
        </div>
        <span className="relative">
          <BsThreeDotsVertical className="cursor-pointer" onClick={() => setOpenPostActions((prev) => !prev)} />
          {openPostActions && (
            <div className="absolute right-0 top-5 z-50">
              <PostCardActions />
            </div>
          )}
        </span>
      </div>
      {/* ========== IMAGE SLIDER =========== */}
      <div className="media">
        <ImageSlider />
      </div>
      {/* ========== ICONS ================== */}
      <div className="icons flex justify-between py-3 text-2xl">
        <div className="flex items-center gap-x-4">
          <span onClick={() => {
            setLiked(!liked);
            setLikesCount(liked ? likesCount - 1 : likesCount + 1);
          }}>
            {liked ? <FaHeart className="text-red-600 cursor-pointer" onClick={() => handleLike()}/> : <FaRegHeart className="cursor-pointer" onClick={() => handleLike()}/>}
          </span>
          <span>
            <IoChatbubbleOutline className=" cursor-pointer" />
          </span>
          <span>
            <PiPaperPlaneTilt className=" cursor-pointer" />
          </span>
        </div>
        <span onClick={() => setSaved(!saved)}>
          {saved ? (
            <FaBookmark className="text-red-600 cursor-pointer" onClick={() => handleSave()}/>
          ) : (
            <FaRegBookmark className="cursor-pointer" onClick={() => handleSave()}/>
          )}
        </span>
      </div>
      {/* ============= LIKES & COMMENTS ============== */}
      <p className="font-semibold text-sm">{likesCount} likes</p>
      <span className="font-semibold text-sm cursor-pointer">{"Poster Name"}</span>
      <p className="postcardCaption text-sm text-black">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, expedita omnis officiis reprehenderit neque
        totam vitae laborum odio iure obcaecati.
      </p>
      <p className=" text-sm mt-2 cursor-pointer">View all {commentsCount} comments...</p>
      {
        displayComment && displayComment.length > 0 && (
          <div className="flex items-center gap-x-2">
            <img src={auth.currentUser.photoURL} className="w-5 h-5 rounded-full" />
            <p className="text-sm font-semibold">{auth.currentUser.displayName}</p>
            <p className="text-sm py-1">{displayComment}</p>
          </div>
        )
      }
      <div className="comment flex pb-2 pt-1 justify-between border-b border-[rgba(0,0,0,0.18)] relative">
        <input 
          type="text" 
          value={comment} 
          placeholder="Add a comment" 
          onChange={e => setComment(e.target.value)} 
          className="w-9/10 text-sm focus:outline-0"
          onKeyDown={e => {
            if(e.key === 'Enter') {
              handleComment(e.target.value)
            }
          }}
        />
        <span className="cursor-pointer" onClick={toggleEmojiPicker}>
          <CiFaceSmile />
        </span>
        {showEmojiPicker && (
          <div className="absolute bottom-10 right-0 z-50" ref={emojiPickerRef}>
            <EmojiPicker 
              onEmojiClick={handleEmojiClick} 
              width={300}
              height={350}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
