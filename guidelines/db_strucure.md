-users/
  |-userId/ (contains userObject)
    |-username
    |-email
    |-imgUrl
    ...()
  |-userId/
  ...
  |-userId/
  ...
-posts/
  |-userId/(all the posts of the user (which one the userId belongs) will be stored here)
    |-postId/(contains post objects)
      |-createdAt
      |-posterId
      |-text
      ...
    |-postId
      ...
    |-postId
      ...
  |-userId/(another user)
    |-postId
    ...
  |-userId/(another user)
    |-postId
    ...
-postMetaData/
  |-postId/
    |-id
    |-likeCounts
    |-comments/
      |-commentId/
        |-commenterId
        |-text
        |-replies/
          |-replyId/
            |-replierId
            |-text
            |-timeStamp
            ...
          |-replyId/
           ...
          |-replyId/
           ...
      |-commentId/
        ...
      |-commentId/
        ...
  |-postId/
    ...
  |-postId/
    ...
-stories/
  |-userId
    |-id (contains)
    ........all similiar structure as posts/
-notifications/
  |-userId/
    |-notificationId/
     |-timeStamp
     |-type
     |-postId
     ...
    |-notificationID/
     ...
    |-notificationID/
     ...
  |-userId/
    ...
  |-userId/
    ...
