import { equalTo, get, orderByChild, push, query, ref, remove, runTransaction, set, update } from "firebase/database";
import { auth, db } from "../../Database/Firebase.config";
import { toast } from "react-toastify";
import { GetTimeNow } from "./date.utils";

//* (HELPER) CHECK IF CURRENT USER IS THE NOTIFICATION TRIGGERER
const checkIfSelfTriggered = (receiverId) =>
  receiverId === auth.currentUser.uid;

//* (HELPER) CREATE DATA FOR NOTIFICATION ================
const CreateNotificationData = (type, postId, receiverId, data = null) => {
  return {
    id: receiverId + Date.now(),
    type,
    postId,
    triggererId: auth.currentUser.uid,
    triggererName: auth.currentUser.displayName,
    triggererImgUrl: auth.currentUser.photoURL,
    receiverId,
    timestamp: Date.now(),
    createdAt: GetTimeNow(),
    read: false,
    data,
  };
};

// TODO: CHECK IF FOLLOWED ===============================
export const CheckIfFollowed = async (userId) => {
  const followRef = ref(db, `followings/${auth.currentUser.uid}/${userId}`);
  const snapshot = await get(followRef);
  return snapshot.exists();
};

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
  const notificationRef = ref(db, `notifications/${userId}`);
  const followNotification = CreateNotificationData("follow", null, userId);
  try {
    await Promise.all([
      set(followingRef, true),
      set(followerRef, true),
      push(notificationRef, followNotification),
    ]);
    toast.info("Follow successfull");
  } catch (error) {
    toast.error("Follow failed");
    console.log(error);
  }
};

// TODO: CHECK IF A POST IS LIKED BY USER OR NOT =========
export const CheckIfLiked = async (postId) => {
  const likeRef = ref( db, `postsMetaData/${postId}/likes/${auth.currentUser.uid}`);
  try {
    const snapshot = await get(likeRef);
    return snapshot.exists();
  } catch (error) {
    console.error("error checking post is liked or not", error);
  }
};

// TODO: LIKE A POST ======================================
export const LikePost = async (postId, posterId) => {
  const postMDLikeRef = ref( db, `postsMetaData/${postId}/likes/${auth.currentUser.uid}` );
  const likesCountRef = ref(db, `postsMetaData/${postId}/likesCount`);
  const notificationRef = ref(db, `notifications/${posterId}`);
  try {
    const operations = [
      set(postMDLikeRef, true),
      runTransaction(likesCountRef, (currentValue) => (currentValue || 0) + 1),
    ];
    if (!checkIfSelfTriggered(posterId)) {
      const likeNotification = CreateNotificationData("like", postId, posterId);
      operations.push(push(notificationRef, likeNotification));
    }
    await Promise.all(operations);
  } catch (error) {
    console.error("Error liking post:", error);
  }
};

// TODO: UNLIKE A POST ======================================
export const UnlikePost = async (postId) => {
  const postMDLikeRef = ref( db, `postsMetaData/${postId}/likes/${auth.currentUser.uid}` );
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

// TODO: DELETE A POST WITH ALL ASSOCIATED LIKES & COMMENTS ===
export const DeletePost = async (postId) => {
  const postsRef = ref(db, `posts/${postId}`);
  const postMDRef = ref(db, `postsMetaData/${postId}`);
  const commentsQuery = query( ref(db, `comments/`), orderByChild("postId"), equalTo(postId));
  const repliesQuery = query( ref(db, `replies/`), orderByChild("postId"), equalTo(postId));
  try {
    const postSnap = await get(postsRef);
    let hashtagUpdates = {};
    if (postSnap.exists() && postSnap.val().hashtags) {
      const hashtags = postSnap.val().hashtags;
      hashtags.forEach((hashTag) => {
        hashtagUpdates[`hashTags/${hashTag}/${postId}`] = null;
      });
    }
    await Promise.all([remove(postsRef), remove(postMDRef)]);
    const updates = { ...hashtagUpdates };
    const commentsSnap = await get(commentsQuery);
    if (commentsSnap.exists()) {
      Object.keys(commentsSnap.val()).forEach((commentKey) => {
        updates[`comments/${commentKey}`] = null;
      });
    }
    const commentsMDSnap = await get(
      query( ref(db, `commentsMetaData`), orderByChild("postId"), equalTo(postId))
    );
    if (commentsMDSnap.exists()) {
      Object.keys(commentsMDSnap.val()).forEach((commentMDKey) => {
        updates[`commentsMetaData/${commentMDKey}`] = null;
      });
    }
    const repliesSnap = await get(repliesQuery);
    if (repliesSnap.exists()) {
      Object.keys(repliesSnap.val()).forEach((replyKey) => {
        updates[`replies/${replyKey}`] = null;
      });
    }
    const repliesMDSnap = await get(
      query(ref(db, `repliesMetaData`), orderByChild("postId"), equalTo(postId))
    );
    if (repliesMDSnap.exists()) {
      Object.keys(repliesMDSnap.val()).forEach((replyMDKey) => {
        updates[`repliesMetaData/${replyMDKey}`] = null;
      });
    }
    await update(ref(db), updates);
    toast.warn("Post deleted.");
  } catch (error) {
    console.error("Error removing post- ", error.message);
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
  };
};

// TODO: ADD A COMMENT TO A POST =================================
export const AddComment = async (postId, posterId, comment) => {
  const commentId = auth.currentUser.uid + Date.now();
  const postMDRef = ref(db, `postsMetaData/${postId}/comments/${commentId}`);
  const commentRef = ref(db, `comments/${commentId}`);
  const commentsCountRef = ref(db, `postsMetaData/${postId}/commentsCount`);
  const notificationRef = ref(db, `notifications/${posterId}`);
  const newComment = CreateCommentData(commentId, postId, comment);
  if (comment.length === 0) {
    toast.error(`Can't post empty comment.`);
    return;
  }
  try {
    const operations = [
      set(commentRef, newComment),
      set(postMDRef, true),
      runTransaction(commentsCountRef, (currentValue) => {
        return (currentValue || 0) + 1;
      }),
    ];
    if (!checkIfSelfTriggered(posterId)) {
      const commentNotification = CreateNotificationData( "comment", postId, posterId, comment );
      operations.push(push(notificationRef, commentNotification));
    }
    await Promise.all(operations);
  } catch (error) {
    console.error("Error posting comment, ", error.message);
  }
};

// TODO: CHECK IF A COMMENT IS LIKED ========================================================
export const CheckIfCommentLiked = async (commentId) => {
  const likeRef = ref(db, `commentsMetaData/${commentId}/likes/${auth.currentUser.uid}` );
  try {
    const snapshot = await get(likeRef);
    return snapshot.exists();
  } catch (error) {
    console.error("error checking post is liked or not", error);
  }
};
// TODO: LIKE A COMMENT =====================================================================
export const LikeComment = async (commentData) => {
  const { id, text, commenterId, postId } = commentData;
  const commentLikesRef = ref( db, `commentsMetaData/${id}/likes/${auth.currentUser.uid}`);
  const commentLikesCountRef = ref(db, `commentsMetaData/${id}/likesCount`);
  const notificationRef = ref(db, `notifications/${commenterId}`);
  try {
    const operations = [set(commentLikesRef, true), runTransaction(commentLikesCountRef, (currentValue) => {
        return (currentValue || 0) + 1;
      }),
    ];
    if (!checkIfSelfTriggered(commenterId)) {
      const likeNotification = CreateNotificationData( "likeOnComment", postId, commenterId, text );
      console.log(auth.currentUser.displayName);
      operations.push(push(notificationRef, likeNotification));
    }
    await Promise.all(operations);
  } catch (error) {
    console.error("Error liking comment", error.message);
  }
};
// TODO: UNLIKE A COMMENT ===================================================================
export const UnlikeComment = async (commentId) => {
  const commentLikesRef = ref( db, `commentsMetaData/${commentId}/likes/${auth.currentUser.uid}` );
  const commentLikesCountRef = ref( db, `commentsMetaData/${commentId}/likesCount` );
  try {
    await Promise.all([remove(commentLikesRef), runTransaction(commentLikesCountRef, (currentValue) => {
        return Math.max((currentValue || 0) - 1, 0);
      }),
    ]);
  } catch (error) {
    console.error("Error unliking comment", error.message);
  }
};
// TODO: DELETE A COMMENT ====================================================================
export const DeleteComment = async (commentId, postId) => {
  const commentCountRef = ref(db, `postsMetaData/${postId}/commentsCount`);
  try {
    const updates = {};
    updates[`comments/${commentId}`] = null;
    updates[`postsMetaData/${postId}/comments/${commentId}`] = null;
    updates[`commentsMetaData/${commentId}`] = null;
    const repliesQuery = query(ref(db, "replies"), orderByChild("commentId"), equalTo(commentId));
    const repliesSnap = await get(repliesQuery);
    if (repliesSnap.exists()) {
      Object.keys(repliesSnap.val()).forEach((replyKey) => {
        updates[`replies/${replyKey}`] = null;
      });
    }
    const repliesMDSnap = await get(query(ref(db, "repliesMetaData"), orderByChild("commentId"), equalTo(commentId)));
    if (repliesMDSnap.exists()) {
      Object.keys(repliesMDSnap.val()).forEach((replyMDKey) => {
        updates[`repliesMetaData/${replyMDKey}`] = null;
      });
    }
    await Promise.all([update(ref(db), updates), runTransaction(commentCountRef, (currentValue) =>
      Math.max((currentValue || 0) - 1, 0)
    )])
    toast.warn("Comment and all its replies deleted.");
  } catch (error) {
    console.error("Error deleting comment", error.message);
  }
};

//* (HELPER) CREATE A REPLY DATA FOR DB ========================
export const CreateReplyData = ( replyId, commentId, postId, commenterName, text ) => {
  return {
    id: replyId,
    postId,
    timeStamp: Date.now(),
    createdAt: GetTimeNow(),
    commentId,
    commenterName,
    replierId: auth.currentUser.uid,
    replierName: auth.currentUser.displayName,
    replierImgUrl: auth.currentUser.photoURL,
    text,
  };
};
// TODO: ADD A REPLY TO A COMMENT =================================
export const AddReply = async ( commentId, commenterId, commenterName, postId, reply ) => {
  const replyId = auth.currentUser.uid + Date.now();
  const commentMDRef = ref(db, `commentsMetaData/${commentId}/replies/${replyId}`);
  const repliesRef = ref(db, `replies/${replyId}`);
  const replyCountRef = ref(db, `commentsMetaData/${commentId}/repliesCount`);
  const newReply = CreateReplyData( replyId, commentId, postId, commenterName, reply );
  const notificationRef = ref(db, `notifications/${commenterId}`);
  if (reply.length === 0) {
    toast.error(`Can't post empty reply.`);
    return;
  }
  try {
    const operations = [
      set(repliesRef, newReply),
      set(commentMDRef, true),
      runTransaction(replyCountRef, (currentValue) => {
        return (currentValue || 0) + 1;
      }),
    ];
    if (!checkIfSelfTriggered(commenterId)) {
      const replyNotification = CreateNotificationData( "reply", postId, commenterId, reply );
      operations.push(push(notificationRef, replyNotification));
    }
    await Promise.all(operations);
  } catch (error) {
    console.error("Error posting reply- ", error.message);
  }
};
// TODO: CHECK IF A REPLY IS LIKED ========================================================
export const CheckIfReplyLiked = async (replyId) => {
  const replyRef = ref( db, `repliesMetaData/${replyId}/likes/${auth.currentUser.uid}` );
  try {
    const snapshot = await get(replyRef);
    return snapshot.exists();
  } catch (error) {
    console.error("error checking reply is liked or not", error);
  }
};
// TODO: LIKE A REPLY =====================================================================
export const LikeReply = async (replyData) => {
  const { id, text, replierId, postId } = replyData;
  const replyLikeRef = ref( db, `repliesMetaData/${id}/likes/${auth.currentUser.uid}` );
  const replyLikesCountRef = ref(db, `repliesMetaData/${id}/likesCount`);
  const notificationRef = ref(db, `notifications/${replierId}`);
  try {
    const operations = [
      set(replyLikeRef, true),
      runTransaction(replyLikesCountRef, (currentValue) => {
        return (currentValue || 0) + 1;
      }),
    ];
    if (!checkIfSelfTriggered(replierId)) {
      const likeNotification = CreateNotificationData( "likeOnReply", postId, replierId, text );
      operations.push(push(notificationRef, likeNotification));
    }
    await Promise.all(operations);
  } catch (error) {
    console.error("Error liking reply- ", error.message);
  }
};
// TODO: UNLIKE A REPLY ===================================================================
export const UnlikeReply = async (replyId) => {
  const replyLikeRef = ref( db, `repliesMetaData/${replyId}/likes/${auth.currentUser.uid}` );
  const replyLikesCountRef = ref(db, `repliesMetaData/${replyId}/likesCount`);
  try {
    await Promise.all([
      await remove(replyLikeRef),
      runTransaction(replyLikesCountRef, (currentValue) => {
        return Math.max((currentValue || 0) - 1, 0);
      }),
    ]);
  } catch (error) {
    console.error("Error unliking reply", error.message);
  }
};
// TODO: DELETE A REPLY ====================================================================
export const DeleteReply = async (replyId, commentId) => {
  const commentMDRef = ref( db, `commentsMetaData/${commentId}/replies/${replyId}` );
  const replyRef = ref(db, `replies/${replyId}`);
  const repliesCountRef = ref(db, `commentsMetaData/${commentId}/repliesCount`);
  const repliesMDRef = ref(db, `repliesMetaData/${replyId}`);
  try {
    await Promise.all([
      remove(replyRef),
      remove(commentMDRef),
      remove(repliesMDRef),
      runTransaction(repliesCountRef, (currentValue) => {
        return Math.max((currentValue || 0) - 1, 0);
      }),
    ]);
    toast.warn("Reply deleted.");
  } catch (error) {
    console.error("Error deleting reply", error.message);
  }
};

// TODO: CHECK IF SAVED & SAVE/REMOVE A POST ===============================================
export const CheckIfSaved = async (postId) => {
  const savedPostRef = ref(db, `savedPosts/${auth.currentUser.uid}/${postId}`);
  const snapshot = await get(savedPostRef);
  return snapshot.exists();
};
export const SavePost = async (postId) => {
  const savedPostRef = ref(db, `savedPosts/${auth.currentUser.uid}/${postId}`);
  try {
    await set(savedPostRef, true);
  } catch (error) {
    console.error("error saving post", error);
  }
};
export const RemoveSavedPost = async (postId) => {
  const savedPostRef = ref(db, `savedPosts/${auth.currentUser.uid}/${postId}`);
  try {
    await remove(savedPostRef);
  } catch (error) {
    console.error("error removing post from save", error);
  }
};

// TODO: CHANGE POST VISIBILITY ==========================================================
export const TogglePostVisibility = async ( visibility, setVisibility, postId ) => {
  const visibilityRef = ref(db, `posts/${postId}/visibility`);
  if (visibility === "public") {
    await set(visibilityRef, "private");
    toast.warn("Post is no longer visible to public");
    setVisibility("private");
  } else if (visibility === "private") {
    await set(visibilityRef, "public");
    toast.success("Post is now visible to public");
    setVisibility("public");
  }
};
