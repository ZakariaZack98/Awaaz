import React, { useState, useEffect } from "react";
import ImageSlider from "../common/ImageSlider";
import { auth } from "../../../Database/Firebase.config";
import { CheckIfFollowed, CheckIfLiked, CheckIfSaved, LikePost, RemoveSavedPost, SavePost, UnlikePost } from "../../utils/actions.utils";
import { toast } from "react-toastify";
import PostHeader from "../common/PostHeader";
import Post from "../../pages/Post/Post";
import PostActionIcons from "../common/PostActionIcons";
import CommentField from "../common/CommentField";
import { FetchLikesCommentsCount } from "../../utils/fetchData.utils";
import FSUserList from "../common/FSUserList";
import PostCardSkeleton from "../Skeleton/PostCardSkeleton";

const PostCard = ({ postData }) => {
  const { id, text, posterId, posterName, imgUrls, videoUrl } = postData;
  const [onlyText, setOnlyText] = useState(!postData.imgUrls && postData.videoUrl.length === 0);
  const [openPostActions, setOpenPostActions] = useState(false);
  const [openPost, setOpenPost] = useState(false);
  const [followed, setFollowed] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [displayComment, setDisplayComment] = useState("");
  const [showLikersList, setShowLikersList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCommentField, setActiveCommentField] = useState(false);

  // TODO: FETCH POST METADATA ==================================
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      FetchLikesCommentsCount(id),
      CheckIfLiked(id),
      CheckIfSaved(id),
      CheckIfFollowed(postData.posterId)
    ])
      .then(([data, liked, saved, followed]) => {
        const [likes, comments] = data;
        setLikesCount(likes || 0);
        setCommentsCount(comments || 0);
        setLiked(liked);
        setSaved(saved);
        setFollowed(followed);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [id, postData.posterId]);

  // TODO: HANDLE POST LIKE ====================================
  const handleLike = async () => {
    liked ? setLikesCount(likesCount - 1) : setLikesCount(likesCount + 1);
    setLiked(liked ? false : true);
    liked ? await UnlikePost(id) : await LikePost(id, posterId);
  };

  // TODO: HANDLE POST SAVE ====================================
  const handleSave = async () => {
    setSaved(saved ? false : true);
    saved ? await RemoveSavedPost(id) : await SavePost(id).then(() => toast.success('Post saved'));
  };

  if (isLoading) {
    return <PostCardSkeleton />;
  }

  return (
    <div className="py-3 px-4 bg-white rounded-md shadow-md">
      {
        openPost && <Post setOpenPost={setOpenPost} postId={postData.id} />
      }
      {
        showLikersList && <FSUserList postId={id} setShowUserList={setShowLikersList} />
      }
      {/* //================ HEADING ====================== */}
      <PostHeader postData={postData} openPostActions={openPostActions} setOpenPostActions={setOpenPostActions} saved={saved} setSaved={setSaved} followed={followed} setFollowed={setFollowed} />
      {/* ==================ONLY TEXT POST'S TEXT CONTENT ======================= */}
      {
        onlyText && <p className="postcardCaption text-2xl text-black cursor-pointer" onClick={() => setOpenPost(true)}>{text}</p>
      }
      {/* ========== MEDIA PART =========== */}
      {imgUrls && imgUrls.length > 1 && <ImageSlider imgUrlArray={imgUrls} />}
      {imgUrls && imgUrls.length === 1 && <img src={imgUrls[0]} alt="" className="w-full object-cover object-center rounded-md overflow-hidden" />}
      {videoUrl && videoUrl.length > 0 && <video src={videoUrl} controls className="w-full rounded-md overflow-hidden"></video>}
      {/* ========== ICONS ================== */}
      <div className="py-2">
        <PostActionIcons liked={liked} saved={saved} handleLike={handleLike} handleSave={handleSave} activeCommentField={activeCommentField} setActiveCommentField={setActiveCommentField}/>
      </div>
      {/* ============= LIKES & COMMENTS ============== */}
      <p className="font-semibold text-sm cursor-pointer" onClick={() => setShowLikersList(true)}>{likesCount} likes</p>
      {
        !onlyText && (
          <>
            <span className="font-semibold text-sm cursor-pointer">{posterName || "Poster Name"}</span>
            <p className="postcardCaption text-sm text-black cursor-pointer" onClick={() => setOpenPost(true)}>{text}</p>
          </>
        )
      }
      {commentsCount > 0 && <p className=" text-sm mt-2 cursor-pointer" onClick={() => setOpenPost(true)}>View all {commentsCount} comments...</p>}
      {displayComment && displayComment.length > 0 && (
        <div className="flex items-center gap-x-2">
          <img src={auth.currentUser.photoURL} className="w-5 h-5 rounded-full" />
          <p className="text-sm font-semibold">{auth.currentUser.displayName}</p>
          <p className="text-sm py-1">{displayComment}</p>
        </div>
      )}
      <CommentField postId={id} posterId={posterId} setDisplayComment={setDisplayComment} commentsCount={commentsCount} setCommentsCount={setCommentsCount} active={activeCommentField}/>
    </div>
  );
};

export default PostCard;
