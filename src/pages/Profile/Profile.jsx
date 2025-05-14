import { useEffect, useState } from "react";
import { FaCog, FaFacebookF, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { BiGridAlt } from "react-icons/bi";
import { BsBookmark } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";
import { equalTo, onValue, orderByChild, query, ref } from "firebase/database";
import { auth, db } from "../../../Database/Firebase.config";
import { useNavigate } from "react-router-dom";

const InstagramProfile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [currentUser, setCurrentUser] = useState({});
  const [currentUserPost, setCurrentUserPost] = useState([]);
  const navigate = useNavigate();

  // Fetch current user data
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const userRef = ref(db, `users/${uid}`);
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setCurrentUser(snapshot.val());
      }
    });
  }, []);

  // Fetch user's posts
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const userPostsQuery = query(
      ref(db, "posts"),
      orderByChild("posterId"),
      equalTo(uid)
    );
    onValue(userPostsQuery, (snapshot) => {
      if (snapshot.exists()) {
        const postsArray = Object.values(snapshot.val());
        setCurrentUserPost(postsArray);
      } else {
        setCurrentUserPost([]);
      }
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <div className="flex items-start space-x-10">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-pink-500 via-yellow-400 to-purple-600 p-[3px]">
          <div className="w-full h-full rounded-full bg-white p-[3px]">
            <div className="w-full h-full rounded-full overflow-hidden relative">
              <img
                src={
                  currentUser?.imgUrl ||
                  "https://images.pexels.com/photos/2297927/pexels-photo-2297927.jpeg"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-black/20 rounded-full" />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-xl font-semibold">{currentUser?.username}</h2>
            <button
              onClick={() => navigate(`/setting`)}
              className="px-3 py-1 border cursor-pointer rounded text-sm font-medium"
            >
              Edit profile
            </button>
            <span className="text-xl cursor-pointer">
              <FaCog />
            </span>
          </div>
          <div className="flex gap-6 text-sm mb-2">
            <span>
              <span className="font-bold">{currentUserPost?.length}</span> posts
            </span>
            <span>
              <span className="font-bold">167</span> followers
            </span>
            <span>
              <span className="font-bold">390</span> following
            </span>
          </div>

          {/* Full Name & Social Media Icons */}
          <div className="font-medium text-sm">
            {currentUser?.fullName || "Mahmudul Hasan"}

            {/* Social Icons */}
            <div className="flex gap-4 mt-2 text-xl">
              <FaFacebookF
                className="text-[#1877F2] cursor-pointer hover:scale-110 transition-transform"
                onClick={() =>
                  navigate(`/profile/facebook/${currentUser?.username}`)
                }
              />
              <FaLinkedinIn
                className="text-[#0A66C2] cursor-pointer hover:scale-110 transition-transform"
                onClick={() =>
                  navigate(`/profile/linkedin/${currentUser?.username}`)
                }
              />
              <FaXTwitter
                className="text-black cursor-pointer hover:scale-110 transition-transform"
                onClick={() => navigate(`/profile/x/${currentUser?.username}`)}
              />
              <FaWhatsapp
                className="text-[#25D366] cursor-pointer hover:scale-110 transition-transform"
                onClick={() =>
                  navigate(`/profile/whatsapp/${currentUser?.username}`)
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="flex gap-6 mt-6">
        <div className="flex flex-col items-center text-sm cursor-pointer">
          <div className="w-16 h-16 border rounded-full flex items-center justify-center text-3xl text-gray-500">
            +
          </div>
          <span className="mt-1">New</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-t pt-4 mt-6 text-sm font-medium">
        <div
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-2 px-2 py-1 cursor-pointer ${
            activeTab === "posts"
              ? "text-black border-t-2 border-black font-bold"
              : "text-gray-500"
          }`}
        >
          <BiGridAlt />
          <span>POSTS</span>
        </div>
        <div
          onClick={() => setActiveTab("saved")}
          className={`flex items-center gap-2 px-4 py-2 cursor-pointer ${
            activeTab === "saved"
              ? "text-black border-t-2 border-black font-bold"
              : "text-gray-500"
          }`}
        >
          <BsBookmark />
          <span>SAVED</span>
        </div>
      </div>

      {/* Posts */}
      {activeTab === "posts" && (
        <div className="flex flex-wrap -m-1 mt-4">
          {currentUserPost.map((post, index) => (
            <div key={index} className="w-1/3 p-1">
              <div className="w-full aspect-[9/16] overflow-hidden rounded-md">
                <img
                  src={post?.imgUrls?.[0]}
                  alt={`Post image`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Saved  */}
      {activeTab === "saved" && (
        <div className="flex flex-wrap -m-1 mt-4">
          {currentUserPost.map((post, index) => (
            <div key={index} className="w-1/3 p-1">
              <div className="w-full aspect-[9/16] overflow-hidden rounded-md">
                <img
                  src={post?.imgUrls?.[0]}
                  alt={`Post image`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstagramProfile;
