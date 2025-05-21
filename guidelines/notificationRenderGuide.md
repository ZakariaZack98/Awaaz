singleNotificationData = {
    id: receiverId + Date.now(),
    type,
    postId, => related post's id
    triggererId, => from who the notification is coming
    triggererName, 
    triggererImgUrl,
    receiverId, => who is receiving the notification
    timestamp, => milisecond value used for sorting notification latest to oldest
    createdAt, => momentjs formatted date (can be use for calling fromNow())
    read: false, => once notification is seen by user, this should be switched to true. Unread notification should render with bold text.
    data, => string containing additional data ie. comment, reply
  }

Notification structure 1:
for type: "like",
Example: Mahmudul Hasan has liked your post.
Onclick: should navigate to `/post/${postId}`

Notification structure 2:
for type: "comment",
Example: Mahmudul Hasan has commented your post- "nyc lagca".
Onclick: should navigate to `/post/${postId}`

Notification structure 3:
for type: "likeOnComment",
Example: Sadee MD Zakaria likes your comment- "thank u".
Onclick: should navigate to `/post/${postId}`

Notification structure 4:
for type: "reply",
Example: Sadee MD Zakaria replied to your comment- "welcome".
Onclick: should navigate to `/post/${postId}`

Notification structure 5:
for type: "likeOnReply",
Example: Sabbir likes your reply- "welcome".
Onclick: should navigate to `/post/${postId}`

Notification structure 6:
for type: "follow",
Example: Sabbir has started follwing you.
Onclick: should navigate to `/profile/${userId}`


