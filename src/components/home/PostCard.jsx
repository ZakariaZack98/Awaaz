import React, { useState, useEffect } from "react";
import ImageSlider from "../common/ImageSlider";
import { auth, db } from "../../../Database/Firebase.config";
import { AddComment, CheckIfFollowed, CheckIfLiked, CheckIfSaved, FetchLikesCommentsCount, LikePost, RemoveSavedPost, SavePost, UnlikePost } from "../../utils/actions.utils";
import { toast } from "react-toastify";
import PostHeader from "../common/PostHeader";
import { mockData } from "../../lib/mockData";
import Post from "../../pages/Post/Post";
import PostActionIcons from "../common/PostActionIcons";
import CommentField from "../common/CommentField";

const PostCard = ({ postData = mockData.postData }) => {
  const { id, text, posterName, imgUrls, videoUrl } = postData;
  const [openPostActions, setOpenPostActions] = useState(false);
  const [openPost, setOpenPost] = useState(false);
  const [followed, setFollowed] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(12);
  const [commentsCount, setCommentsCount] = useState(28);
  const [comment, setComment] = useState("");
  const [displayComment, setDisplayComment] = useState("");

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
    <div className="p-3 bg-white rounded-md shadow-md">
      {
        openPost && <Post setOpenPost={setOpenPost} postData={postData} followed={followed} setFollowed={setFollowed} liked={liked} likesCount={likesCount} saved={saved} setSaved={setSaved} handleLike={handleLike} handleSave={handleSave} comment={comment} setComment={setComment} handleComment={handleComment} onlyText={!imgUrls && videoUrl.length === 0}/>
      }
      {/* //================ HEADING ====================== */}
      <PostHeader postData={postData} openPostActions={openPostActions} setOpenPostActions={setOpenPostActions} saved={saved} setSaved={setSaved} followed={followed} setFollowed={setFollowed}/>
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
      <div className="py-2">
        <PostActionIcons liked={liked} saved={saved} handleLike={handleLike} handleSave={handleSave}/>
      </div>
      {/* ============= LIKES & COMMENTS ============== */}
      <p className="font-semibold text-sm">{likesCount} likes</p>
      <span className="font-semibold text-sm cursor-pointer">{posterName || "Poster Name"}</span>
      <p className="postcardCaption text-sm text-black">{text}</p>
      {commentsCount > 0 && <p className=" text-sm mt-2 cursor-pointer" onClick={() => setOpenPost(true)}>View all {commentsCount} comments...</p>}
      {displayComment && displayComment.length > 0 && (
        <div className="flex items-center gap-x-2">
          <img src={auth.currentUser.photoURL} className="w-5 h-5 rounded-full" />
          <p className="text-sm font-semibold">{auth.currentUser.displayName}</p>
          <p className="text-sm py-1">{displayComment}</p>
        </div>
      )}
      <CommentField postId={id} comment={comment} setComment={setComment} handleComment={handleComment}/>
    </div>
  );
};

export default PostCard;
