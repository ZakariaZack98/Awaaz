import React, { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import ImageSlider from "../common/ImageSlider";
import PostCardActions from "./PostCardActions";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { IoChatbubbleOutline } from "react-icons/io5";
import { PiPaperPlaneTilt } from "react-icons/pi";
import { CiFaceSmile } from "react-icons/ci";
import EmojiPicker from "emoji-picker-react";
import { auth, db } from "../../../Database/Firebase.config";
import moment from "moment";
import { AddComment, CheckIfFollowed, CheckIfLiked, CheckIfSaved, FetchLikesCommentsCount, LikePost, RemoveSavedPost, SavePost, UnlikePost } from "../../utils/actions.utils";
import { toast } from "react-toastify";

const PostCard = ({ postData }) => {
  const { id, text, posterUsername, posterId, posterName, posterImgUrl, createdAt, imgUrls, videoUrl } = postData;
  const [openPostActions, setOpenPostActions] = useState(false);
  const [followed, setFollowed] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(12);
  const [commentsCount, setCommentsCount] = useState(28);
  const [comment, setComment] = useState("");
  const [displayComment, setDisplayComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  // TODO: FETCH POST METADATA ==================================
  useEffect(() => {
  Promise.all([
    FetchLikesCommentsCount(id),
    CheckIfLiked(id),
    CheckIfSaved(id),
    CheckIfFollowed(postData.posterId)
  ])
  .then(([data, liked, saved, followed]) => {
    const [likes, comments] = data;
    if(likes) {
      setLikesCount(likes)
    } else setLikesCount(0)
    if(comments) {
      setCommentsCount(comments)
    } else setCommentsCount(0)
    setLiked(liked)
    setSaved(saved)
    setFollowed(followed)
  })
  .catch(err => console.error(err))
}, [])

  // TODO: CLOSE EMOJI PICKER WHEN CLICKED OUTSIDE ==============
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEmojiClick = (emojiObject) => {
    setComment((prevComment) => prevComment + emojiObject.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  // TODO: DISPLAY COMMENT ON POSTCARD & POST COMMENT TO POST DB
  const handleComment = async (postId) => {
    if(comment.length === 0) {
        toast.error(`Can't post empty comment.`);
        return;
    }
    try {
      await AddComment(postId, comment);
      setDisplayComment(comment);
      setCommentsCount(commentsCount + 1);
    } catch (error) {
      console.error('Error posting comment', error.message)
    } finally {
      setComment("");
    }
  };

  // TODO: HANDLE POST LIKE ====================================
  const handleLike = async () => {
    liked ? setLikesCount(likesCount - 1) : setLikesCount(likesCount + 1)
    setLiked(liked ? false : true);
    liked ? await UnlikePost(id) : await LikePost(id)
  };
  
  // TODO: HANDLE POST SAVE ====================================
  const handleSave = async () => {
    setSaved(saved ? false : true);
    saved ? await RemoveSavedPost(id) : await SavePost(id)
  };

  return (
    //================ HEADING ======================//
    <div className="p-3 bg-white rounded-md shadow-md">
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
              <PostCardActions postData={postData} setOpenPostActions={setOpenPostActions} saved={saved} setSaved={setSaved} followed={followed} setFollowed={setFollowed}/>
            </div>
          )}
        </span>
      </div>
      {/* ========== MEDIA PART =========== */}
      {imgUrls && imgUrls.length > 1 && (
        <div className="media">
          <ImageSlider imgUrlArray={imgUrls}/>
        </div>
      )}
      {
        imgUrls && imgUrls.length === 1 && (
          <picture className="w-full">
            <img src={imgUrls[0]} alt="" className="w-full object-cover object-center"/>
          </picture>
        )
      }
      {
        videoUrl && videoUrl.length > 0 && (
          <video src={videoUrl} controls className="w-full"></video>
        )
      }
      {/* ========== ICONS ================== */}
      <div className="icons flex justify-between py-3 text-2xl">
        <div className="flex items-center gap-x-4">
          <span>
            {liked ? (
              <FaHeart className="text-red-600 cursor-pointer" onClick={() => handleLike()} />
            ) : (
              <FaRegHeart className="cursor-pointer" onClick={() => handleLike()} />
            )}
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
            <FaBookmark className="text-red-600 cursor-pointer" onClick={() => handleSave()} />
          ) : (
            <FaRegBookmark className="cursor-pointer" onClick={() => handleSave()} />
          )}
        </span>
      </div>
      {/* ============= LIKES & COMMENTS ============== */}
      <p className="font-semibold text-sm">{likesCount} likes</p>
      <span className="font-semibold text-sm cursor-pointer">{posterName || "Poster Name"}</span>
      <p className="postcardCaption text-sm text-black">{text}</p>
      {commentsCount > 0 && <p className=" text-sm mt-2 cursor-pointer">View all {commentsCount} comments...</p>}
      {displayComment && displayComment.length > 0 && (
        <div className="flex items-center gap-x-2">
          <img src={auth.currentUser.photoURL} className="w-5 h-5 rounded-full" />
          <p className="text-sm font-semibold">{auth.currentUser.displayName}</p>
          <p className="text-sm py-1">{displayComment}</p>
        </div>
      )}
      <div className="comment flex pb-2 pt-4 justify-between border-b border-[rgba(0,0,0,0.18)] relative">
        <input
          type="text"
          value={comment}
          placeholder="Add a comment"
          onChange={(e) => setComment(e.target.value)}
          className="w-9/10 text-sm focus:outline-0"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleComment(id);
            }
          }}
        />
        <span className="cursor-pointer" onClick={toggleEmojiPicker}>
          <CiFaceSmile />
        </span>
        {showEmojiPicker && (
          <div className="absolute bottom-10 right-0 z-50" ref={emojiPickerRef}>
            <EmojiPicker onEmojiClick={handleEmojiClick} width={300} height={350} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
