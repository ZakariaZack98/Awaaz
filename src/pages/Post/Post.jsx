import React, { useEffect, useState } from "react";
import ImageSlider from "../../components/common/ImageSlider";
import PostHeader from "../../components/common/PostHeader";
import { mockData } from "../../lib/mockData";
import { MdClose } from "react-icons/md";
import PostActionIcons from "../../components/common/PostActionIcons";
import { get, limitToFirst, query, ref } from "firebase/database";
import { db } from "../../../Database/Firebase.config";
import { FetchUserData } from "../../utils/fetchData.utils";

const Post = ({
  postData = mockData.postData,
  setOpenPost,
  followed,
  setFollowed,
  liked,
  likesCount,
  handleLike,
  handleSave,
  saved,
  setSaved,
}) => {
  const { id, text, posterName, imgUrls, videoUrl } = postData;
  const [openPostActions, setOpenPostActions] = useState(false);
  const [likerName, setLikerName] = useState(null);
  useEffect(() => {
    const getFirstLikerName = async () => {
      const likesRef = ref(db, `postsMetaData/${id}/likes`);
      const singleLikerQuery = query(likesRef, limitToFirst(1));
      try {
        const snapshot = await get(singleLikerQuery);
        if (snapshot.exists()) {
          console.log('running')
          const likes = snapshot.val();
          const likerId = Object.keys(likes)[0];
          const userData = await FetchUserData(likerId);
          console.log('userdata-', userData)
          setLikerName(userData?.fullName || 'Random person');
        }
      } catch (error) {
        console.error("Error fetching single liker:", error);
        return null;
      }
    };
    getFirstLikerName();
  }, []);

  return (
    <div
      className="w-screen h-screen absolute top-0 left-0 flex justify-center items-center bg-[rgba(0,0,0,0.48)]"
      style={{ zIndex: 500 }}>
      <div className="absolute top-5 right-5 cursor-pointer text-white">
        <span className="text-3xl">
          <MdClose onClick={() => setOpenPost(false)} />
        </span>
      </div>
      <div
        className="postBox w-[70dvw] h-[92dvh] flex bg-white"
        style={{ boxShadow: "0px 0px 10px 10px rgba(0,0,0,0.1)" }}>
        <div className="media h-full w-1/2 bg-black flex items-center">
          {imgUrls?.length > 1 && <ImageSlider inPost={true} imgUrlArray={imgUrls} />}
          {imgUrls?.length === 1 && (
            <img src={imgUrls[0]} alt="" className="w-full h-ful object-conatin object-center" />
          )}
          {videoUrl && videoUrl?.length > 0 && <video src={videoUrl} controls className="w-full"></video>}
        </div>
        <div className="rightSection h-full w-1/2 flex flex-col border-b border-t border-e">
          <div className="header h-1/10 border-b border-[rgba(0,0,0,0.26)] p-2">
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
          <div className="caption&comments h-[68%]"></div>
          <div className="likes&others h-[12%] border-t border-[rgba(0,0,0,0.26)] p-3">
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
                  Liked by <strong>{likerName}</strong>
                </p>
              )}
              {likesCount > 1 && (
                <p className="text-sm">
                  Liked by
                  <strong>{likerName}</strong> &<strong className="cursor-pointer">{likesCount - 1}</strong>
                  others
                </p>
              )}
            </div>
          </div>
          <div className="footer h-1/10 border-t border-[rgba(0,0,0,0.26)]"></div>
        </div>
      </div>
    </div>
  );
};

export default Post;
