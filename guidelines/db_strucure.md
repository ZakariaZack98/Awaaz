-users/
  |-userId/ (contains userObject)
    |-username
    |-email
    |-imgUrl
    |-bio
    |-blockedIds/
      |-uid1: true
      |-uid2: true
    |-blockedByIds/
      |-uid3: true
      |-uid4: true
    |-socialHandles/
      |-facebook/
        |-name: "Facebook"
        |-url: "https://fb.com/xyz"
      |-twitter/
        |-name: "Twitter"
        |-url: "https://twitter.com/xyz"
    ...()

-allPosts/
  |-postId/ (contains flat post object)
    |-createdAt
    |-posterId
    |-posterName
    |-posterImgUrl
    |-visibility
    |-text
    |-imgUrls/
      |-0: "imgUrl1"
      |-1: "imgUrl2"
    |-videoUrl
    |-hashtags/
      |-0: "trendy"
      |-1: "recipe"
    |-likeCounts

-postMetaData/
  |-postId/
    |-likesCount
    |-comments/
      |-commentId1: true
      |-commentId2: true

-allComments/
  |-commentId/
    |-postId
    |-commenterId
    |-commenterName
    |-commenterImgUrl
    |-text
    |-imgUrl
    |-likeCounts
    |-replies/
      |-replyId1: true
      |-replyId2: true

-allReplies/
  |-replyId/
    |-commentId
    |-replierId
    |-replierName
    |-replierImgUrl
    |-text
    |-imgUrl
    |-likeCounts

-allStories/
  |-storyId/
    |-createdAt
    |-posterId
    |-posterName
    |-posterImgUrl
    |-visibility
    |-text
    |-imgUrl
    |-videoUrl
    |-likeCounts
    |-comments/
      |-commentId1: true
      |-commentId2: true

-notifications/
  |-notificationId/
    |-timestamp
    |-type
    |-postId
    |-fromUserId
    |-triggererName
    |-triggererImgUrl
    |-toUserId
    |-read
    |-data/
      |-text
      |-likeCount

-followers/
  |-userId/ (this user is being followed by these uids)
    |-followerId1: true
    |-followerId2: true
    |-followerId3: true

-following/
  |-userId/ (this user is following these uids)
    |-followingId1: true
    |-followingId2: true
    |-followingId3: true


================================== QWERY GUIDE ===================================
IE.: Get all post from a certain user


const postsRef = ref(db, 'allPosts');
const userPostsQuery = query(postsRef, orderByChild('posterId'), equalTo('user123'));

get(userPostsQuery).then(snapshot => {
  if (snapshot.exists()) {
    const posts = snapshot.val();
    console.log("User's Posts:", posts);
  } else {
    console.log("No posts found for this user.");
  }
});

** orderByChild: the key name under our query factor is stored (this case, 'posterId')
** equalTo: the value we want to match with our desired data (this case, 'user123' which belongs to the user whose posts we are quering)

(READ DOCS FOOR MORE INFO)