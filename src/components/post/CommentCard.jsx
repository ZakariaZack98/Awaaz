import React, { useEffect, useState } from "react";
import moment from "moment";
import { GoDotFill } from "react-icons/go";
import { FaRegHeart } from "react-icons/fa";
import { FaAngleRight, FaHeart, FaTrashCan } from "react-icons/fa6";
import { CheckIfCommentLiked, DeleteComment, LikeComment, UnlikeComment } from "../../utils/actions.utils";
import { auth, db } from "../../../Database/Firebase.config";
import { FetchCommentLikesCount, FetchCommentReplyCount } from "../../utils/fetchData.utils";
import ReplyPrompt from "./ReplyPrompt";
import { equalTo, onValue, orderByChild, query, ref } from "firebase/database";
import ReplyCard from "./ReplyCard";

const CommentCard = ({ commentData, commentsDataArr, setCommentsDataArr }) => {
  const {id, text, commenterName, commenterImgUrl, createdAt, postId } = commentData;
  const [likesCount, setLikesCount] = useState(0);
  const [repliesCount, setRepliesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [openReplyPrompt, setOpenReplyPrompt] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [repliesData, setRepliesData] = useState([]);

  // TODO: FETCH COMMENT'S REPLIES =================================
  useEffect(() => {
    const repliesRef = ref(db, `replies/`);
    const replyQuery = query(repliesRef, orderByChild("commentId"), equalTo(id));
    const unsubscribe = onValue(replyQuery, snapshot => {
      if(snapshot.exists()) {
        const repliesDataArr = Object.values(snapshot.val()).sort((a, b) => b.timeStamp - a.timeStamp);
        setRepliesData(repliesDataArr);
      } else {
        setRepliesData([]);
      }
    });
    return () => unsubscribe();
}, [id]);

  // TODO: CHECK IF THE COMMENT IS LIKED & FETCH LIKES AND REPLY COUNT ===
  useEffect(() => {
    Promise.all([
      CheckIfCommentLiked(id),
      FetchCommentLikesCount(id),
      FetchCommentReplyCount(id)
    ])
    .then(data => {
      const [likeStatus, likes, replies] = data;
      setLiked(likeStatus);
      setLikesCount(likes);
      setRepliesCount(replies);
    })
    .catch(console.error)
  }, [commentsDataArr, repliesData])

  const handleCommentLike = async () => {
    liked ? setLikesCount(likesCount - 1) : setLikesCount(likesCount + 1)
    setLiked(prev => !prev);
    liked ? await UnlikeComment(id) : await LikeComment(commentData);
  }
  return (
    <div className="flex gap-x-2 py-3 w-full">
      <div className="left">
        <picture>
          <img src={commenterImgUrl} className="min-w-9 w-9 h-9 rounded-full object-cover object-center" />
        </picture>
      </div>
      <div className="right w-9/10">
        <div className="top flex gap-x-4">
          <p className="text-sm">
            <strong className="me-2">{commenterName}<FaAngleRight className=" inline mb-0.5 ms-2 opacity-60"/></strong>
            {text}
          </p>
        </div>
        <div className="bottom w-full flex justify-between gap-x-2 text-sm opacity-70">
          <div className="flex gap-x-2">
            <p>{moment(createdAt).fromNow()}</p>
            <GoDotFill className="translate-y-0.5"/>
            <p className="font-medium">{likesCount} Likes</p>
            <GoDotFill className="translate-y-0.5"/>
            <p className="font-medium cursor-pointer" onClick={() => setOpenReplyPrompt(prev => !prev)}>Reply</p>
          </div>
          <div className="flex gap-x-3">
            {
              commentData.commenterId === auth.currentUser.uid || commentData.postId.includes(auth.currentUser.uid) ? <FaTrashCan className="text-red-500 cursor-pointer" onClick={() => {
                DeleteComment(id, postId).then(() => {
                  setCommentsDataArr(commentsDataArr.filter(comment => comment.id !== id))
                })
              }}/> : null
            }
            <span onClick={() => handleCommentLike()}>
              {liked ? <FaHeart className="text-red-500 text-md cursor-pointer"/> : <FaRegHeart className=" text-md cursor-pointer"/>}
            </span>
          </div>
        </div>
        {
          openReplyPrompt && <ReplyPrompt commentData={commentData} setOpenReplyPrompt={setOpenReplyPrompt} repliesCount={repliesCount} setRepliesCount={setRepliesCount} setShowReplies={setShowReplies}/>
        }
        {
          repliesCount > 0 && (
            <div className="flex items-center gap-x-3 pt-2 cursor-pointer" onClick={() => setShowReplies(prev => !prev)}>
              <span className="h-[1px] w-4 bg-mainfontColor"></span>
              <p className="text-sm">{showReplies ? 'Hide' : 'Show'} {repliesCount > 1 ? 'all' : ''} <strong>{repliesCount} {repliesCount > 1 ? 'replies' : 'reply'}</strong></p>
            </div>
          )
        }
        {
          showReplies && (
            <div className="repliesSec">
              {
                repliesData?.map(reply => <ReplyCard replyData={reply} commentData={commentData} repliesCount={repliesCount} setRepliesCount={setRepliesCount}/>)
              }
            </div>
          )
        }
      </div>
    </div>
  );
};

export default CommentCard;
