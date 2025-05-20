import { equalTo, get, onValue, orderByChild, query, ref } from "firebase/database";
import { db } from "../../Database/Firebase.config";

// TODO: FETCH A USER'S DATA WITH USER ID ========================================
export const FetchUserData = async (uid) => {
  const userRef = ref(db, `users/${uid}`);
  try {
    const userSnapshot = await get(userRef);
    if (userSnapshot.exists()) {
      return userSnapshot.val();
    } else console.log("User data not found");
  } catch (error) {
    console.log("Error fetching user data", error.message);
  }
};

// TODO: FETCH A POST'S COMMENTS WITH POST ID ====================================
export const FetchComments = (postId) => {
  const commentsRef = ref(db, `comments`);
  const postCommentQuery = query(commentsRef, orderByChild("postId"), equalTo(postId));
  try {
    onValue(postCommentQuery, snapshot => {
      if (snapshot.exists()) {
      const comments = snapshot.val();
      return Object.values(comments).sort((a, b) => b.timeStamp - a.timeStamp);
    } else {
      console.log("No comments found for this post");
      return [];
    }
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};


// TODO: FETCH A POST'S LIKES & COMMENTS COUNT (FOR POST) ==========================
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

// TODO: FETCH A COMMENT'S LIKES COUNT ==============================================
export const FetchCommentLikesCount = async commentId => {
  const likesCountRef = ref(db, `commentsMetaData/${commentId}/likesCount`)
  try {
    const snapshot = await get(likesCountRef);
    if (snapshot.exists()) {
      return snapshot.val()
    } else return 0;
  } catch (error) {
    console.error('Error fetching comments likes count', error.message)
  }
}

// TODO: FETCH A COMMENT'S REPLY COUNT ==============================================
export const FetchCommentReplyCount = async commentId => {
  const replyCountRef = ref(db, `commentsMetaData/${commentId}/repliesCount`)
  try {
    const snapshot = await get(replyCountRef);
    if(snapshot.exists()) {
      return snapshot.val();
    } else return 0;
  } catch (error) {
    console.error('Error fetching comments likes count', error.message)
  }
}

// TODO: FETCH A RIPLY'S LIKES COUNT ==============================================
export const FetchReplyLikesCount = async replyId => {
  const likesCountRef = ref(db, `repliesMetaData/${replyId}/likesCount`)
  try {
    const snapshot = await get(likesCountRef);
    if (snapshot.exists()) {
      return snapshot.val()
    } else return 0;
  } catch (error) {
    console.error('Error fetching comments likes count', error.message)
  }
}

