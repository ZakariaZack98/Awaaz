//* OBJECT TO STORE AN USER ===========================
userObject = {
  userId: auth.currentUser.uid,
  username: "johndoe22",
  fullName: "John Doe",
  email: "jondoe@gmail.com",
  imgUrl: "https://cloudinarystorage.com/fakelink.png",
  gender: "male",
  bio: "Man is both the marble and the sculptor", //? user's bio
  isLocked: false, //? If locked, only shown to friends
  friendList: {
    hidden: false, //? If hidden, do not display on profile
    list: [{ friendObject }, { friendObject }, ...more], //? friendObject containing friend's uid & timestamp of friendship
  },
  followingIds: {
    hidden: false, //? If hidden, do not display on profile
    list: [uid, uid, ...more], //? array containing following's uid s
  },
  followerIds: {
    hidden: false, //? If hidden, do not display on profile
    list: [uid, uid, ...more], //? array containing followers uids
  },
  blockedIds: [uid, uid, ...more], //? array containing blocked uids
  blockedByIds: [uid, uid, ...more], //? array containing ids that user is blocked on
  defaultTheme: "light", //? user preferred theme will be applied after log-in.
  postCount: 28, //? Total number of active posts
  socialHandles: [{ socialHandleObj }, { socialHandleObj }, ...more], //? Array of object containing user's other social handles. structure:- {name, url}
};

//* OBJECT TO STORE A POST ============================
postObject = {
  id: Date.now() + auth.currentUser.uid, //? post's unique ID (combining uid and timestamp)
  timeStamp: Date.now(), //? timestamp of post creation
  posterId: "7qdwdy87d98aa8dw8d7wd8", //? comes from auth.currentUser.uid
  posterName: currentUser.displayName, //? denormalized name
  posterImgUrl: currentUser.photoUrl, //? denormalized photoUrl
  createdAt: GetTimeNow(), //? comes from momment JS's time formatter
  visibility: "public", //? public || private || friends
  text: "Lorem Ipsum", //? comment's text
  imgUrls: ["imgUrl", "imgUrl", ...more], //? post's photo urls (if there any)
  videoUrl: "https://cloudinarystorage.com/fakelink.mp4", //? post's video's url (if there any)
  likeCounts: 12, //? number of likes
  comments: [{ commentObject }, { commentObject }, ...more], //? array conatining comment objects,
  hashtags: ["trendy, recipe, foodchallenge"], //? hashtags in text (should be extracted from post's text)
};

//* OBJECT TO UPDATE POST METADATA =====================
postMetaDataObject = {
  id: postObject.id, //? same id as the post
  likesCount: 12, //? number of likes
  comments: [{ commentObject }, { commentObject }, ...more], //? array conatining comment objects,
};

//* OBJECT TO STORE A STORY ============================
storyObject = {
  id: Date.now() + auth.currentUser.uid, //? post's unique ID (combining uid and timestamp)
  timeStamp: Date.now(), //? timestamp of post creation
  posterId: "7qdwdy87d98aa8dw8d7wd8", //? comes from auth.currentUser.uid
  posterName: currentUser.displayName, //? denormalized name
  posterImgUrl: currentUser.photoUrl, //? denormalized photoUrl
  createdAt: GetTimeNow(), //? comes from momment JS's time formatter
  visibility: "public", //? public || private || friends
  text: "Lorem Ipsum", //? comment's text
  imgUrl: "https://dummyimage.com/dummy.png", //? Story's Picture url
  videoUrl: "https://cloudinarystorage.com/fakelink.mp4", //? post's video's url (if there any)
  likeCounts: 12, //? number of likes
  comments: [{ commentObject }, { commentObject }, ...more], //? array conatining comment objects,
};

//* OBJECT TO STORE A COMMENT =========================
commentObject = {
  id: Date.now() + auth.currentUser.uid,
  timeStamp: Date.now(), //? timestamp of post creation //? post's unique ID (combining uid and timestamp)
  createdAt: GetTimeNow(), //? comes from momment JS's time formatter
  commenterId: "7qdwdy87d98aa8dw8d7wd8", //? comes from auth.currentUser.uid
  commenterName: currentUser.displayName, //? denormalized name
  commenterImgUrl: currentUser.photoUrl, //? denormalized photoUrl
  text: "Lorem Ipsum", //? comment's text
  imgUrl: "https://cloudinarystorage.com/fakelink.png", //? commented photo's url (if there any)
  likeCounts: 0, //? number of likes of the comment
  replies: [{ replyObject }, { replyObject }, ...more], //? Array of object conataining the comment's replies
};

//* OBJECT TO STORE A COMMENT =========================
replyObject = {
  id: Date.now() + auth.currentUser.uid, //? post's unique ID (combining uid and timestamp)
  timeStamp: Date.now(), //? timestamp of post creation
  createdAt: GetTimeNow(), //? comes from momment JS's time formatter
  replierId: "7qdwdy87d98aa8dw8d7wd8", //? comes from auth.currentUser.uid
  replierName: currentUser.displayName, //? denormalized name
  replierImgUrl: currentUser.photoUrl, //? denormalized photoUrl
  text: "Lorem Ipsum", //? comment's text
  imgUrl: "https://cloudinarystorage.com/fakelink.png", //? commented photo's url (if there any)
  likeCounts: 0, //? number of likes of the comment
  // NO FURTHER REPLIES
};

//* OBJECT TO STORE A NOTIFICATION =====================
notificationObject = {
  type: string, //? "like", "comment", "follow", etc.
  postId: string, // ?ID of the post related to the notification
  fromUserId: string, //? ID of the user who triggered the notification
  triggererName: currentUser.displayName, //? denormalized name
  triggererImgUrl: currentUser.photoUrl, //? denormalized photoUrl
  toUserId: string, //? ID of the user who received the notification
  timestamp: number, //? timestamp of when the notification was created
  read: boolean, //? whether the notification has been read by the user
  data: object, //? additional data related to the notification (e.g. comment text, like count) *optional
};
