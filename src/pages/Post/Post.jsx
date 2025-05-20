import React, { useEffect, useState } from "react";
import ImageSlider from "../../components/common/ImageSlider";
import PostHeader from "../../components/common/PostHeader";
import { MdClose } from "react-icons/md";
import PostActionIcons from "../../components/common/PostActionIcons";
import { equalTo, get, limitToFirst, onValue, orderByChild, query, ref } from "firebase/database";
import { db } from "../../../Database/Firebase.config";
import { FetchUserData } from "../../utils/fetchData.utils";
import CommentField from "../../components/common/CommentField";
import CommentCard from "../../components/post/CommentCard";
import PostSkeleton from "../../components/post/PostSekeleton";
import { CheckIfFollowed, CheckIfLiked, CheckIfSaved } from "../../utils/actions.utils";
import { toast } from "react-toastify";

const Post = ({ postData, setOpenPost }) => {
  const { id, text, posterId, posterName, posterImgUrl, imgUrls, videoUrl } = postData;
  const onlyText = !imgUrls && videoUrl.length === 0;
  const [followed, setFollowed] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [openPostActions, setOpenPostActions] = useState(false);
  const [likerName, setLikerName] = useState(null);
  const [commentsData, setCommentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: FETCH ALL THE NECESSARY DATA TO RENDER POST POPUP ===
  useEffect(() => {
    const getFirstLikerName = async () => {
      const likesRef = ref(db, `postsMetaData/${id}/likes`);
      const singleLikerQuery = query(likesRef, limitToFirst(1));
      try {
        const snapshot = await get(singleLikerQuery);
        if (snapshot.exists()) {
          const likes = snapshot.val();
          const likerId = Object.keys(likes)[0];
          const userData = await FetchUserData(likerId);
          setLikerName(userData?.fullName || 'Random person');
        }
      } catch (error) {
        console.error("Error fetching single liker:", error);
        return null;
      }
    };
    setIsLoading(true);
    Promise.all([
      getFirstLikerName(),
      CheckIfLiked(id),
      CheckIfSaved(id),
      CheckIfFollowed(id),
    ])
      .then(data => {
        const [_, liked, saved, followed] = data;
        setLiked(liked);
        setSaved(saved);
        setFollowed(followed);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  }, [id]);

  // TODO: LISTEN TO COMMENTS OF THIS POST ==========================================
  useEffect(() => {
    const commentsRef = ref(db, `comments/`);
    const postCommentQuery = query(commentsRef, orderByChild("postId"), equalTo(id));
    const unsub = onValue(postCommentQuery, snapshot => {
      if (snapshot.exists()) {
        const comments = snapshot.val();
        setCommentsData(Object.values(comments).sort((a, b) => b.timeStamp - a.timeStamp));
      } else {
        console.log("No comments found for this post");
        return [];
      }
    })
    return () => unsub();
  }, [])

  // TODO: HANDLE POST LIKE ====================================
  const handleLike = async () => {
    liked ? setLikesCount(likesCount - 1) : setLikesCount(likesCount + 1)
    setLiked(liked ? false : true);
    liked ? await UnlikePost(id) : await LikePost(id, posterId)
    toast.success('Post saved.')
  };

  // TODO: HANDLE POST SAVE ====================================
  const handleSave = async () => {
    setSaved(saved ? false : true);
    saved ? await RemoveSavedPost(id) : await SavePost(id)
  };

  if (isLoading) {
    return <PostSkeleton onlyText={onlyText} />;
  }

  return (
    <div
      className="w-screen h-screen absolute top-0 left-0 flex justify-center items-center bg-[rgba(0,0,0,0.7)]"
      style={{ zIndex: 500 }}>
      <div className="absolute top-5 right-5 cursor-pointer text-white">
        <span className="text-3xl">
          <MdClose onClick={() => setOpenPost(false)} />
        </span>
      </div>
      <div
        className={`postBox h-[92dvh] flex overflow-hidden ${onlyText ? 'w-[40dvw]' : 'w-[70dvw]'}`}
        style={{ boxShadow: "0px 0px 10px 10px rgba(0,0,0,0.1)" }}>
        {
          !onlyText && (
            <div className="media h-full w-1/2 bg-black flex items-center">
              {imgUrls?.length > 1 && <ImageSlider inPost={true} imgUrlArray={imgUrls} />}
              {imgUrls?.length === 1 && <img src={imgUrls[0]} alt="" className="w-full h-ful object-conatin object-center" />}
              {videoUrl && videoUrl?.length > 0 && <video src={videoUrl} controls className="w-full"></video>}
            </div>
          )
        }
        <div className={`rightSection h-full ${onlyText ? 'w-full' : 'w-1/2'} flex flex-col justify-between border-b border-t border-e bg-white`}>
          <div className="header h-15 border-b border-[rgba(0,0,0,0.26)] p-2">
            <PostHeader
              postData={postData}
              openPostActions={openPostActions}
              setOpenPostActions={setOpenPostActions}
              followed={followed}
              setFollowed={setFollowed}
              saved={saved}
              setSaved={setSaved}
            />
          </div>
          <div className="caption&comments h-[68%] overflow-y-scroll p-3" style={{ scrollbarWidth: 'none' }}>
            <div className="captionSec flex gap-x-3">
              <picture>
                <img src={posterImgUrl} className="min-w-10 w-10 h-10 rounded-full object-cover object-center" />
              </picture>
              <p className="text-sm"><strong className="me-4">{posterName}</strong>{text}</p>
            </div>
            <div className="commentSec my-4">
              {
                commentsData?.map(comment => <CommentCard commentData={comment} commentsDataArr={commentsData} setCommentsDataArr={setCommentsData} />)
              }
            </div>
          </div>
          <div className="likes&others h-17 border-t border-[rgba(0,0,0,0.26)] p-3">
            <div className="flex flex-col justify-center gap-y-1">
              <PostActionIcons
                postId={id}
                liked={liked}
                saved={saved}
                handleLike={handleLike}
                handleSave={handleSave}
              />
              {likesCount === 0 && (
                <p className="text-sm">
                  No likes yet
                </p>
              )}
              {likesCount === 1 && (
                <p className="text-sm">
                  Liked by <strong> {likerName} </strong>
                </p>
              )}
              {likesCount > 1 && (
                <p className="text-sm">
                  Liked by
                  <strong> {likerName} </strong> & <strong className="cursor-pointer"> {likesCount - 1} </strong>
                  others
                </p>
              )}
            </div>
          </div>
          <div className="commentField h-13 border-t border-[rgba(0,0,0,0.26)] px-3">
            <CommentField postId={id} posterId={posterId} inPost />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
