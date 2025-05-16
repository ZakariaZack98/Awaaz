//* OBJECT TO STORE A USER ===========================
userObject = {
  userId: auth.currentUser.uid,
  username: "johndoe22",
  fullName: "John Doe",
  email: "jondoe@gmail.com",
  imgUrl: "https://cloudinarystorage.com/fakelink.png",
  gender: "male",
  bio: "Man is both the marble and the sculptor", //? user's bio
  isLocked: false, //? If locked, only shown to friends
  blockedIds: { uid1: true, uid2: true }, //? object of blocked uids
  blockedByIds: { uid3: true, uid4: true }, //? object of uids that blocked the user
  defaultTheme: "light", //? user preferred theme will be applied after log-in.
  postCount: 28, //? Total number of active posts
  socialHandles: {
    facebook: { name: "Facebook", url: "https://fb.com/xyz" },
    twitter: { name: "Twitter", url: "https://twitter.com/xyz" },
  }, //? object of user's other social handles
};

//* FLAT OBJECT TO STORE ALL POSTS ====================
allPosts = {
  postId: {
    id: auth.currentUser.uid + Date.now(),
    timeStamp: Date.now(),
    posterId: auth.currentUser.uid,
    posterUsername: currentUser.username,
    posterName: currentUser.displayName, //? denormalized name
    posterImgUrl: currentUser.photoUrl, //? denormalized photoUrl
    createdAt: GetTimeNow(), //? formatted timestamp
    visibility: "public", //? public || private || friends
    text: "Lorem Ipsum",
    imgUrls: ["imgUrl", "imgUrl"],
    videoUrl: "https://cloudinarystorage.com/fakelink.mp4",
    likeCounts: 12,
    hashtags: ["trendy", "recipe", "foodchallenge"],
  }
};

//* FLAT OBJECT TO STORE POST METADATA ===============
postMetaData = {
  postId: {
    likesCount: 12,
    comments: {
      commentId1: true,
      commentId2: true,
    }, //? references to comment IDs
  }
};

//* FLAT OBJECT TO STORE ALL COMMENTS ================
allComments = {
  commentId: {
    id: auth.currentUser.uid + Date.now(),
    timeStamp: Date.now(),
    createdAt: GetTimeNow(),
    postId: "postId", //? link back to post
    commenterId: auth.currentUser.uid,
    commenterName: currentUser.displayName,
    commenterImgUrl: currentUser.photoUrl,
    text: "Lorem Ipsum",
    imgUrl: "https://cloudinarystorage.com/fakelink.png",
    likeCounts: 0,
    replies: {
      replyId1: true,
      replyId2: true,
    }, //? references to reply IDs
  }
};

//* FLAT OBJECT TO STORE ALL REPLIES ==================
allReplies = {
  replyId: {
    id: auth.currentUser.uid + Date.now(),
    timeStamp: Date.now(),
    createdAt: GetTimeNow(),
    commentId: "commentId", //? link back to comment
    replierId: auth.currentUser.uid,
    replierName: currentUser.displayName,
    replierImgUrl: currentUser.photoUrl,
    text: "Lorem Ipsum",
    imgUrl: "https://cloudinarystorage.com/fakelink.png",
    likeCounts: 0,
  }
};

//* FLAT OBJECT TO STORE STORIES ======================
allStories = {
  storyId: {
    id: auth.currentUser.uid + Date.now(),
    timeStamp: Date.now(),
    posterId: auth.currentUser.uid,
    posterName: currentUser.displayName,
    posterImgUrl: currentUser.photoUrl,
    createdAt: GetTimeNow(),
    visibility: "public",
    text: "Lorem Ipsum",
    imgUrl: "https://dummyimage.com/dummy.png",
    videoUrl: "https://cloudinarystorage.com/fakelink.mp4",
    likeCounts: 12,
    comments: {
      commentId1: true,
      commentId2: true,
    },
  }
};

//* FLAT OBJECT TO STORE NOTIFICATIONS ===============
notifications = {
  notificationId: {
    id: this.toUserId + Date.now(), //? receiver's id + timestamp
    type: "like", //? or "comment", "follow", etc.
    postId: "postId",
    fromUserId: "userId",
    triggererName: currentUser.displayName,
    triggererImgUrl: currentUser.photoUrl,
    toUserId: "userId",
    timestamp: Date.now(),
    read: false,
    data: { text: "optional comment text", likeCount: 1 },
  }
};
