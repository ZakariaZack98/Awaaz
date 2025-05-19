import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaAngleRight, FaHeart, FaRegHeart, FaTrashCan } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { auth } from "../../../Database/Firebase.config";
import ReplyPrompt from "./ReplyPrompt";
import { CheckIfReplyLiked, DeleteReply, LikeReply, UnlikeReply } from "../../utils/actions.utils";
import { FetchReplyLikesCount } from "../../utils/fetchData.utils";

const ReplyCard = ({ replyData, commentData, repliesCount, setRepliesCount }) => {
  const { id, text, replierId, replierName, replierImgUrl, createdAt, commentId, commenterName } = replyData;
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [openReplyPrompt, setOpenReplyPrompt] = useState(false);

  // TODO: FETCH LIKED OR NOT & LIKES COUNT OF THE REPLY ===
  useEffect(() => {
    Promise.all([
      CheckIfReplyLiked(id),
      FetchReplyLikesCount(id)
    ])
    .then(data => {
      const [likeStatus, likes] = data;
      setLiked(likeStatus);
      setLikesCount(likes);
    })
    .catch(console.error)
  }, [liked])

  const handleReplyLike = async () => {
      liked ? setLikesCount(likesCount - 1) : setLikesCount(likesCount + 1)
      setLiked(prev => !prev);
      liked ? await UnlikeReply(id) : await LikeReply(id);
    }

  return (
    <div className="flex gap-x-2 py-3 w-full">
      <div className="left">
        <picture>
          <img src={replierImgUrl} className="min-w-9 w-9 h-9 rounded-full object-cover object-center" />
        </picture>
      </div>
      <div className="right w-9/10">
        <div className="top flex gap-x-4">
          <p className="text-sm">
            <strong className="me-2">
              {replierName}
              <FaAngleRight className=" inline mb-0.5  opacity-60" />
            </strong>
            <strong className="text-red-700">{commentData.commenterName !== commenterName ? `@${commenterName} ` : ''}</strong>{text}
          </p>
        </div>
        <div className="bottom w-full flex justify-between gap-x-2 text-sm opacity-70">
          <div className="flex gap-x-2">
            <p>{moment(createdAt).fromNow()}</p>
            <GoDotFill className="translate-y-0.5" />
            <p className="font-medium">{likesCount} Likes</p>
            <GoDotFill className="translate-y-0.5" />
            <p className="font-medium cursor-pointer" onClick={() => setOpenReplyPrompt((prev) => !prev)}>Reply</p>
          </div>
          <div className="flex gap-x-3">
            {replierId === auth.currentUser.uid || commentId.includes(auth.currentUser.uid) ? (
              <FaTrashCan
                className="text-red-500 cursor-pointer"
                onClick={() => DeleteReply(id, commentData.id)}
              />
            ) : null}
            <span onClick={() => handleReplyLike()}>
              {liked ? (
                <FaHeart className="text-red-500 text-md cursor-pointer" />
              ) : (
                <FaRegHeart className=" text-md cursor-pointer" />
              )}
            </span>
          </div>
        </div>
        {openReplyPrompt && <ReplyPrompt commentData={commentData} replierName={replierName} setOpenReplyPrompt={setOpenReplyPrompt} repliesCount={repliesCount} setRepliesCount={setRepliesCount}/>}
      </div>
    </div>
  );
};

export default ReplyCard;
