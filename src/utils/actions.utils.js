import { get, ref, remove, runTransaction, set } from "firebase/database";
import { auth, db } from "../../Database/Firebase.config";
import { toast } from "react-toastify";
import { GetTimeNow } from "./date.utils";

// TODO: CHECK IF FOLLOWED ===============================
export const CheckIfFollowed = async userId => {
  const followRef = ref(db, `followings/${auth.currentUser.uid}/${userId}`);
  const snapshot = await get(followRef);
  return snapshot.exists();
}

// TODO: UNFOLLOW A USER ==================================
export const Unfollow = async (userId) => {
  const followingRef = ref(db, `followings/${auth.currentUser.uid}/${userId}`);
  const followerRef = ref(db, `followers/${userId}/${auth.currentUser.uid}`);
  try {
    await Promise.all([remove(followingRef), remove(followerRef)]);
    toast.info("Unfollow successfull");
  } catch (error) {
    toast.error("Unfollow failed");
    console.log(error);
  }
};
// TODO: FOLLOW A USER ==================================
export const Follow = async (userId) => {
  const followingRef = ref(db, `followings/${auth.currentUser.uid}/${userId}`);
  const followerRef = ref(db, `followers/${userId}/${auth.currentUser.uid}`);
  try {
    await Promise.all([set(followingRef, true), set(followerRef, true)]);
    //! CREATE A NOTIFICATION
    toast.info("Follow successfull");
  } catch (error) {
    toast.error("Follow failed");
    console.log(error);
  }
};

// TODO: CHECK IF A POST IS LIKED BY USER OR NOT =========
export const CheckIfLiked = async postId => {
  const likeRef = ref(db, `postsMetaData/${postId}/likes/${auth.currentUser.uid}`);
  try {
    const snapshot = await get(likeRef);
    return snapshot.exists()
  } catch (error) {
    console.error('error checking post is liked or not', error)
  }
}

// TODO: LIKE A POST ======================================
export const LikePost = async (postId) => {
  const postMDLikeRef = ref(db, `postsMetaData/${postId}/likes/${auth.currentUser.uid}`);
  const likesCountRef = ref(db, `postsMetaData/${postId}/likesCount`);
  try {
    await set(postMDLikeRef, true);
    await runTransaction(likesCountRef, (currentValue) => {
      return (currentValue || 0) + 1;
    });
    //! CREATE A NOTIFICATION
  } catch (error) {
    console.error(error);
  }
};

// TODO: UNLIKE A POST ======================================
export const UnlikePost = async (postId) => {
  const postMDLikeRef = ref(db, `postsMetaData/${postId}/likes/${auth.currentUser.uid}`);
  const likesCountRef = ref(db, `postsMetaData/${postId}/likesCount`);
  try {
    await remove(postMDLikeRef);
    await runTransaction(likesCountRef, (currentValue) => {
      return Math.max((currentValue || 0) - 1, 0);
    });
  } catch (error) {
    console.error(error);
  }
};

//* (HELPER) CREATE A COMMENT DATA FOR DB ========================
export const CreateCommentData = (commentId, postId, text) => {
  return {
    id: commentId,
    timeStamp: Date.now(),
    createdAt: GetTimeNow(),
    postId,
    commenterId: auth.currentUser.uid,
    commenterName: auth.currentUser.displayName,
    commenterImgUrl: auth.currentUser.photoURL,
    text,
    likeCounts: 0,
  }
}

// TODO: ADD A COMMENT TO A POST =================================
export const AddComment = async (postId, comment, imgUrl) => {
  const commentId = auth.currentUser.uid + Date.now();
  const postMDRef = ref(db, `postsMetaData/${postId}/comments/${commentId}`)
  const commentRef = ref(db, `comments/${commentId}`);
  const newComment = CreateCommentData(commentId, postId, comment);
  const commentsCountRef = ref(db, `postsMetaData/${postId}/commentsCount`);
  if(comment.length === 0) {
    toast.error(`Can't post empty comment.`);
    return;
  }
  try {
    await Promise.all([
      set(commentRef, newComment), 
      set(postMDRef, true), 
      runTransaction(commentsCountRef, (currentValue) => {
        return (currentValue || 0) + 1;
      })
    ]);
    console.log('comment posted')
    //! CREATE A NOTIFICATION
  } catch (error) {
    console.error('Error posting comment, ', error.message)
  }
}


// TODO: CHECK IF SAVED & SAVE/REMOVE A POST ===============================================
export const CheckIfSaved = async postId => {
  const savedPostRef = ref(db, `savedPosts/${auth.currentUser.uid}/${postId}`);
  const snapshot = await get(savedPostRef);
  return snapshot.exists();
}
export const SavePost = async postId => {
  const savedPostRef = ref(db, `savedPosts/${auth.currentUser.uid}/${postId}`)
  try {
    await set(savedPostRef, true);
  } catch (error) {
    console.error('error saving post', error)
  }
}
export const RemoveSavedPost = async postId => {
  const savedPostRef = ref(db, `savedPosts/${auth.currentUser.uid}/${postId}`)
  try {
    await remove(savedPostRef);
  } catch (error) {
    console.error('error removing post from save', error)
  }
}


// TODO: CHECK IF A COMMENT IS LIKED ========================================================
export const CheckIfCommentLiked = async commentId => {
  const likeRef = ref(db, `commentsMetaData/${commentId}/likes/${auth.currentUser.uid}`);
  try {
    const snapshot = await get(likeRef);
    return snapshot.exists()
  } catch (error) {
    console.error('error checking post is liked or not', error)
  }
}
// TODO: LIKE A COMMENT =====================================================================
export const LikeComment = async commentId => {
  const commentLikesRef = ref(db, `commentsMetaData/${commentId}/likes/${auth.currentUser.uid}`);
  const commentLikesCountRef = ref(db, `commentsMetaData/${commentId}/likesCount`);
  try {
    await Promise.all([set(commentLikesRef, true), runTransaction(commentLikesCountRef, (currentValue) => {
      return (currentValue || 0) + 1;
    })]);
  } catch (error) {
    console.error('Error liking comment', error.message)
  }
}
// TODO: UNLIKE A COMMENT ===================================================================
export const UnlikeComment = async commentId => {
  const commentLikesRef = ref(db, `commentsMetaData/${commentId}/likes/${auth.currentUser.uid}`)
  const commentLikesCountRef = ref(db, `commentsMetaData/${commentId}/likesCount`)
  try {
    await Promise.all([await remove(commentLikesRef), runTransaction(commentLikesCountRef, (currentValue) => {
      return Math.max((currentValue || 0) - 1, 0);
    })])
  } catch (error) {
    console.error('Error unliking comment', error.message)
  }
}
// TODO: DELETE A COMMENT ====================================================================
export const DeleteComment = async (commentId, postId) => {
  const postMDRef = ref(db, `postsMetaData/${postId}/comments/${commentId}`)
  const commentRef = ref(db, `comments/${commentId}`);
  const commentCountRef = ref(db, `postsMetaData/${postId}/commentsCount`);
  const commentMDRef = ref(db, `commentsMetaData/${commentId}`);
  try {
    await Promise.all([remove(commentRef), remove(postMDRef), remove(commentMDRef), runTransaction(commentCountRef, (currentValue) => {
      return Math.max((currentValue || 0) - 1, 0);
    })]);
    toast.warn('Comment deleted.')
  } catch (error) {
    console.error('Error deleting comment', error.message)
  }
}

//* (HELPER) CREATE A REPLY DATA FOR DB ========================
export const CreateReplyData = (replyId, commentId, commenterName, text) => {
  return {
    id: replyId,
    timeStamp: Date.now(),
    createdAt: GetTimeNow(),
    commentId,
    commenterName,
    replierId: auth.currentUser.uid,
    replierName: auth.currentUser.displayName,
    replierImgUrl: auth.currentUser.photoURL,
    text,
  }
}
// TODO: ADD A REPLY TO A COMMENT =================================
export const AddReply = async (commentId, commenterName, reply) => {
  const replyId = auth.currentUser.uid + Date.now();
  const commentMDRef = ref(db, `commentsMetaData/${commentId}/replies/${replyId}`)
  const repliesRef = ref(db, `replies/${replyId}`);
  const replyCountRef = ref(db, `commentsMetaData/${commentId}/repliesCount`);
  const newReply = CreateReplyData(replyId, commentId, commenterName, reply);
  if(reply.length === 0) {
    toast.error(`Can't post empty comment.`);
    return;
  }
  try {
    await Promise.all([
      set(repliesRef, newReply), 
      set(commentMDRef, true), 
      runTransaction(replyCountRef, (currentValue) => {
        return (currentValue || 0) + 1;
      })
    ]);
    console.log('reply posted')
    //! CREATE A NOTIFICATION
  } catch (error) {
    console.error('Error posting reply, ', error.message)
  }
}
// TODO: CHECK IF A REPLY IS LIKED ========================================================
export const CheckIfReplyLiked = async replyId => {
  const replyRef = ref(db, `repliesMetaData/${replyId}/likes/${auth.currentUser.uid}`);
  try {
    const snapshot = await get(replyRef);
    return snapshot.exists()
  } catch (error) {
    console.error('error checking reply is liked or not', error)
  }
}
// TODO: LIKE A COMMENT =====================================================================
export const LikeReply = async replyId => {
  const replyLikeRef = ref(db, `repliesMetaData/${replyId}/likes/${auth.currentUser.uid}`);
  const replyLikesCountRef = ref(db, `repliesMetaData/${replyId}/likesCount`);
  try {
    await Promise.all([set(replyLikeRef, true), runTransaction(replyLikesCountRef, (currentValue) => {
      return (currentValue || 0) + 1;
    })]);
  } catch (error) {
    console.error('Error liking reply', error.message)
  }
}
// TODO: UNLIKE A COMMENT ===================================================================
export const UnlikeReply = async replyId => {
  const replyLikeRef = ref(db, `repliesMetaData/${replyId}/likes/${auth.currentUser.uid}`);
  const replyLikesCountRef = ref(db, `repliesMetaData/${replyId}/likesCount`);
  try {
    await Promise.all([await remove(replyLikeRef), runTransaction(replyLikesCountRef, (currentValue) => {
      return Math.max((currentValue || 0) - 1, 0);
    })])
  } catch (error) {
    console.error('Error unliking reply', error.message)
  }
}
// TODO: DELETE A REPLY ====================================================================
export const DeleteReply = async (replyId, commentId) => {
  const commentMDRef = ref(db, `commentsMetaData/${commentId}/replies/${replyId}`)
  const replyRef = ref(db, `replies/${replyId}`);
  const repliesCountRef = ref(db, `commentsMetaData/${commentId}/repliesCount`);
  const repliesMDRef = ref(db, `repliesMetaData/${replyId}`);
  try {
    await Promise.all([remove(replyRef), remove(commentMDRef), remove(repliesMDRef), runTransaction(repliesCountRef, (currentValue) => {
      return Math.max((currentValue || 0) - 1, 0);
    })]);
    toast.warn('Reply deleted.')
  } catch (error) {
    console.error('Error deleting reply', error.message)
  }
}
