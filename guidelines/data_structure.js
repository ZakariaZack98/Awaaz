//* OBJECT TO STORE AN USER ===========================
userObject = {
  userId: auth.currentUser.uid,
  username: 'johndoe22',
  fullName: 'John Doe',
  email: 'jondoe@gmail.com'
}

//* OBJECT TO STORE A POST ============================
PostObject = {
  id: Date.now() + auth.currentUser.uid, //? post's unique ID (combining uid and timestamp)
  posterId: "7qdwdy87d98aa8dw8d7wd8", //? comes from auth.currentUser.uid
  createdAt: GetTimeNow(), //? comes from momment JS's time formatter
  likeCounts: 12, //? number of likes
  comments: [{commentObject}, {commentObject}, ...more], //? array conatining comment objects,
}

//* OBJECT TO STORE A COMMENT =========================
CommentObject = {
  id: Date.now() + auth.currentUser.uid, //? post's unique ID (combining uid and timestamp)
  createdAt: GetTimeNow(), //? comes from momment JS's time formatter
  commenterId: "7qdwdy87d98aa8dw8d7wd8", //? comes from auth.currentUser.uid
  text: "Lorem Ipsum", //? comment's text
  imgUrl: "https://cloudinarystorage.com/fakelink.png", //? commented photo's url (if there any)
  likeCounts: 0, //? number of likes of the comment
  replies: [{replyObject}, {replyObject}, ...more] //? Array of object conataining the comment's replies
}

//* OBJECT TO STORE A COMMENT =========================
ReplyObject = {
  id: Date.now() + auth.currentUser.uid, //? post's unique ID (combining uid and timestamp)
  createdAt: GetTimeNow(), //? comes from momment JS's time formatter
  replierId: "7qdwdy87d98aa8dw8d7wd8", //? comes from auth.currentUser.uid
  text: "Lorem Ipsum", //? comment's text
  imgUrl: "https://cloudinarystorage.com/fakelink.png", //? commented photo's url (if there any)
  likeCounts: 0, //? number of likes of the comment
  // NO FURTHER REPLIES
}