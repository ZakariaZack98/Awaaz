import { get, ref, remove, runTransaction, set } from "firebase/database";
import { auth, db } from "../../Database/Firebase.config";
import { toast } from "react-toastify";
import { GetTimeNow } from "./date.utils";

// TODO: FETCH A POST'S LIKES & COMMENTS COUNT ==========================
export const FetchLikesCommentsCount = async postId => {
  const likeCountRef = ref(db, `postsMetaData/${postId}/likesCount`);
  const commentCountRef = ref(db, `postsMetaData/${postId}/commentsCount`);
  try {
    const snapshots = await Promise.all([get(likeCountRef), get(commentCountRef)]);
    const counts = [];
    snapshots.forEach(snapshot => counts.push(snapshot.val()));
    return counts;
  } catch (error) {
    console.error('Error fetching like & comment count ',error)
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
export const CreateCommentData = (commentId, postId, text, imgUrl) => {
  return {
    id: commentId,
    timeStamp: Date.now(),
    createdAt: GetTimeNow(),
    postId,
    commenterId: auth.currentUser.uid,
    commenterName: auth.currentUser.displayName,
    commenterImgUrl: auth.currentUser.photoURL,
    text,
    imgUrl: imgUrl || null,
    likeCounts: 0,
  }
}

// TODO: ADD A COMMENT TO A POST =================================
export const AddComment = async (postId, comment, imgUrl) => {
  const commentId = auth.currentUser.uid + Date.now();
  const postMDRef = ref(db, `postsMetaData/${postId}/comments/${commentId}`)
  const commentRef = ref(db, `comments/${commentId}`);
  const newComment = CreateCommentData(commentId, postId, comment, imgUrl);
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
  await set(savedPostRef, true);
}
export const RemoveSavedPost = async postId => {
  const savedPostRef = ref(db, `savedPosts/${auth.currentUser.uid}/${postId}`)
  await remove(savedPostRef);
}