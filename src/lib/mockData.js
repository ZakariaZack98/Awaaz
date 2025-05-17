import { GetTimeNow } from "../utils/date.utils";

export const mockData = {};

mockData.postData = {
  id: "asduy8d9dskdj298wdud",
  timeStamp: Date.now(),
  posterId: "2937dni2d2908hd90",
  posterUsername: "zakaria786",
  posterName: "Sadee MD Zakaria", //? denormalized name
  posterImgUrl: "https://cdn.britannica.com/40/59040-050-BEAE1332/fjords-North-Sea-coast-Norway.jpg", //? denormalized photoUrl
  createdAt: GetTimeNow(), //? formatted timestamp
  visibility: "public", //? public || private || friends
  text: "Lorem Ipsum",
  imgUrls: [
    "https://images.ctfassets.net/7mmwp5vb96tc/82025/9b855abd4e17b3e674065fe3928972a3/hjorundfjord-norway-hgr-141715_1920-photo_fabrice_milochau.jpg?q=40&w=3840&fm=webp",
    "https://cdn.britannica.com/40/59040-050-BEAE1332/fjords-North-Sea-coast-Norway.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/7/78/Geirangerfjord_%286-2007%29.jpg",
  ],
  videoUrl: "",
  hashtags: ["trendy", "recipe", "foodchallenge"],
};

mockData.commentData = {
  id: "asduy8d9dskdj298wdud",
  timeStamp: Date.now(),
  createdAt: GetTimeNow(),
  postId: "1283812dsd86sdsad86", 
  commenterId: 'sdi88ad09ow8dd8yw9d8y',
  commenterName: 'Tony Stark',
  commenterImgUrl: 'https://cdn.britannica.com/40/59040-050-BEAE1332/fjords-North-Sea-coast-Norway.jpg',
  text: "This is a sample comment",
  likeCounts: 0,
  // replies: {
  //   replyId1: true,
  //   replyId2: true,
  // }, //? references to reply IDs
};
