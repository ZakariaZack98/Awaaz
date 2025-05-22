import React, { useContext, useState } from "react";
import { _ } from "../../lib/lib";
import { IoMdCloseCircle } from "react-icons/io";
import { GetTimeNow } from "../../utils/date.utils";
import { uploadFiles } from "../../utils/fileuploads.utils";
import { toast } from "react-toastify";
import { ref, set } from "firebase/database";
import { auth, db } from "../../../Database/Firebase.config";
import { DataContext } from "../../contexts/DataContexts";
import { FaPaperPlane } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const PostCreationLabel = () => {
  const iconsAndLabels = _.postCreationIconsAndLabels;
  const [openUploadPrompt, setOpenUploadPrompt] = useState(false);
  const [caption, setCaption] = useState("");
  const [filePathsArr, setFilePathsArr] = useState([]);
  const [photoFiles, setPhotoFiles] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPath, setVideoPath] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { currentUser } = useContext(DataContext);
  const navigate = useNavigate()

  // TODO: SHOW THE PREVIEW OF THE UPLOADED PHOTOS UNDER THE UPLOAD PROPMPT
  const handlePreview = (e, filetype) => {
    setVideoFile(null);
    setVideoPath(null);
    const files = e.target.files;
    setPhotoFiles(Array.from(files));
    const filePaths = Array.from(files).map((file) => URL.createObjectURL(file));
    if (filetype === "video") {
      setPhotoFiles(null);
      setFilePathsArr(null);
      setVideoFile(e.target.files[0]);
      setVideoPath(filePaths[0]);
    } else setFilePathsArr(filePaths);
  };

  //TODO: HANLE REMOVING A PICTURE/VIDEO FROM UPLOAD
  const handleRemove = (filetype, idx) => {
    if (filetype === "video") {
      setVideoPath("");
      setVideoFile(null);
    } else {
      const updatedFilePathsArr = [...filePathsArr];
      updatedFilePathsArr.splice(idx, 1);
      setFilePathsArr(updatedFilePathsArr);
      const updatedPhotoFiles = [...photoFiles];
      updatedPhotoFiles.splice(idx, 1);
      setPhotoFiles(updatedPhotoFiles);
    }
  };

  //TODO: HANDLE POST UPLOAD ========================================
  const handlePostUpload = async () => {
    if (isUploading) return; // Prevent multiple uploads
    if (caption.length === 0) {
      toast.error(`You have to write something`);
      return;
    }

    setIsUploading(true); // Start loading

    try {
      let imgUrls = [];
      let videoUrl = "";
      if (photoFiles && photoFiles.length > 0) {
        imgUrls = await uploadFiles(photoFiles);
      } else if (videoFile) {
        const uploaded = await uploadFiles([videoFile]);
        videoUrl = uploaded[0] || "";
      }

      const postId = auth.currentUser.uid + Date.now();
      const postRef = ref(db, `/posts/${postId}`);
      const activePostRef = ref(db, `users/${auth.currentUser.uid}/activePosts`);
      const hashTagsArr = caption.split(" ")
        .filter((word) => word.startsWith("#"))
        .map(hashtag => hashtag.slice(1));

      const newPost = {
        id: postId,
        timeStamp: Date.now(),
        posterUsername: currentUser.username,
        posterId: auth.currentUser.uid,
        posterName: auth.currentUser.displayName,
        posterImgUrl: auth.currentUser.photoURL,
        createdAt: GetTimeNow(),
        visibility: "public",
        text: caption,
        imgUrls,
        videoUrl,
        hashtags: hashTagsArr,
      };

      const operations = [
        set(postRef, newPost),
        set(activePostRef, currentUser.activePosts + 1 || 1)
      ];

      if (hashTagsArr.length > 0) {
        hashTagsArr.forEach(hashTag => {
          operations.push(set(ref(db, `hashTags/${hashTag}/${postId}`), true))
        });
      }

      await Promise.all(operations);
      toast.success("Posting successful");
      setOpenUploadPrompt(false);

    } catch (error) {
      toast.error(`Post upload failed: ${error.message}`);
      console.log(error);
    } finally {
      setIsUploading(false);
      setCaption("");
      setPhotoFiles(null);
      setVideoFile(null);
      setFilePathsArr([]);
      setVideoPath(null);
    }
  };

  return (
    <div className="relative w-full z-50">
      <div className="flex flex-col p-3 rounded-md shadow-md bg-white">
        <div className="top flex items-center justify-between gap-x-2 pb-3 border-b border-gray-200">
          <picture className="min-w-10 h-10">
            <img
              src={
                currentUser?.imgUrl ||
                "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png"
              }
              className="w-10 h-10 rounded-full object-cover object-center"
            />
          </picture>
          <input
            type="text"
            value={caption}
            placeholder={isUploading ? 'Uploading...' : `What's on your mind?`}
            onChange={(e) => setCaption(e.target.value)}
            className={`px-5 py-2 rounded-3xl focus:outline-0 bg-gray-100 w-9/10 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={isUploading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isUploading) {
                handlePostUpload();
              }
            }}
          />
          <button className="rounded-full bg-blue-500 text-white p-3 cursor-pointer">
            <FaPaperPlane/>
          </button>
        </div>
        <div className="bottom flex justify-between items-center px-3 pt-2 text-mainfontColor">
          {iconsAndLabels?.map((item, idx) => (
            <div
              key={item.label}
              className={`flex items-center gap-x-2 cursor-pointer hover:bg-gray-100 duration-200 rounded-md px-2 py-0.5 ${idx === 1 && openUploadPrompt ? 'bg-gray-200' : ''}`}
              onClick={idx === 1 ? () => setOpenUploadPrompt((prev) => !prev) : idx === 2 ? () => navigate('/add_story') : null}>
              <span className={`text-3xl ${item.colorClass}`}>
                <item.icon />
              </span>
              <p className="font-semibold text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
      {openUploadPrompt && (
        <div className="absolute -bottom-53 left-0 w-full p-3 shadow-md rounded-md bg-white h-50 border-2 border-blue-500">
          <div className="flex h-8 gap-x-2 w-full">
            <label
              htmlFor="upload"
              className="px-5 w-1/2 py-1 bg-blue-500 hover:bg-blue-800 text-white duration-200 cursor-pointer">
              📷 Click to upload photos
            </label>
            <input
              type="file"
              multiple
              id="upload"
              name="upload"
              className="hidden"
              accept="image/*"
              onChange={(e) => handlePreview(e, "photo")}
            />
            <label
              htmlFor="uploadVideo"
              className="px-5 py-1 w-1/2  bg-green-500 hover:bg-green-800 text-white duration-200 cursor-pointer">
              🎬 Click to upload a video
            </label>
            <input
              type="file"
              id="uploadVideo"
              name="uploadVideo"
              className="hidden"
              accept="video/mp4, video/avi, video/mkv"
              onChange={(e) => handlePreview(e, "video")}
            />
          </div>
          <div className="album w-full overflow-x-scroll flex gap-x-2 h-8/10 pt-2">
            {filePathsArr && filePathsArr.length > 0 ? (
              filePathsArr.map((url, idx) => (
                <div className="relative h-full max-w-5/10 overflow-hidden">
                  <img src={url} className="h-full"></img>
                  <div className="absolute right-2 top-2">
                    <span className="text-white cursor-pointer text-xl ">
                      <IoMdCloseCircle
                        onClick={() => handleRemove("photo", idx)}
                        className="border rounded-full text-red-500 opacity-80 hover:opacity-100"
                      />
                    </span>
                  </div>
                </div>
              ))
            ) : videoPath && videoPath.length > 0 ? (
              <div className="relative">
                <video controls src={videoPath} className="max-w-5/10 h-full"></video>
                <span className=" absolute left-2 top-2 cursor-pointer text-xl text-white">
                  <IoMdCloseCircle onClick={() => handleRemove("video")} className="border rounded-full shadow" />
                </span>
              </div>
            ) : (
              <div className="w-full h-full flex justify-center items-center text-sm opacity-50">
                <i>No file(s) selected</i>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCreationLabel;
