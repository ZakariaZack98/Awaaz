import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { BiGridAlt } from "react-icons/bi";
import { BsBookmark } from "react-icons/bs";
import { RiFolderVideoFill } from "react-icons/ri";
import {
  onValue,
  query,
  ref,
  orderByChild,
  equalTo,
  set,
  remove,
} from "firebase/database";
import { db } from "../../../Database/Firebase.config";
import { DataContext } from "../../contexts/DataContexts";
import ProfileSkeleton from "./ProfileSkeleton";

const Profile = () => {
  const { userId } = useParams();
  const [profileUserData, setProfileUserData] = useState(null);
  const [profileUserPost, setProfileUserPost] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const { currentUser } = useContext(DataContext);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);
  const navigate = useNavigate();

  // Follow check
  useEffect(() => {
    if (!currentUser?.userId || !userId) return;
    const followRef = ref(db, `followers/${userId}/${currentUser.userId}`);
    onValue(followRef, (snapshot) => {
      setIsFollowing(snapshot.exists());
    });
  }, [currentUser?.userId, userId]);

  // Follower count
  useEffect(() => {
    if (!userId) return;
    const followersRef = ref(db, `followers/${userId}`);
    onValue(followersRef, (snapshot) => {
      setFollowersCount(
        snapshot.exists() ? Object.keys(snapshot.val()).length : 0
      );
    });
  }, [userId]);

  // Following count
  useEffect(() => {
    if (!userId) return;
    const followingRef = ref(db, `followings/${userId}`);
    onValue(followingRef, (snapshot) => {
      setFollowingCount(
        snapshot.exists() ? Object.keys(snapshot.val()).length : 0
      );
    });
  }, [userId]);

  // User data and posts
  useEffect(() => {
    if (!userId) return;

    const userRef = ref(db, `users/${userId}`);
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) setProfileUserData(snapshot.val());
    });

    const postsQuery = query(
      ref(db, "posts"),
      orderByChild("posterId"),
      equalTo(userId)
    );

    onValue(postsQuery, (snapshot) => {
      setProfileUserPost(
        snapshot.exists() ? Object.values(snapshot.val()) : []
      );
    });
  }, [userId]);

  // Saved posts
  useEffect(() => {
    if (activeTab !== "saved" || !userId) return;

    const savedRef = ref(db, `savedPosts/${userId}`);
    onValue(savedRef, (snapshot) => {
      if (snapshot.exists()) {
        const savedKeys = Object.keys(snapshot.val());

        const allPostRef = ref(db, "posts");
        onValue(allPostRef, (postSnap) => {
          if (postSnap.exists()) {
            const allPosts = postSnap.val();
            const filtered = savedKeys
              .map((key) => allPosts[key])
              .filter(Boolean);
            setSavedPosts(filtered);
          }
        });
      } else {
        setSavedPosts([]);
      }
    });
  }, [activeTab, userId]);

  const handleFollowToggle = () => {
    if (!currentUser?.userId || !userId) return;

    const followerRef = ref(db, `followers/${userId}/${currentUser.userId}`);
    const followingRef = ref(db, `followings/${currentUser.userId}/${userId}`);

    if (isFollowing) {
      remove(followerRef)
        .then(() => remove(followingRef))
        .then(() => setIsFollowing(false))
        .catch((error) => console.error("Unfollow Error:", error));
    } else {
      set(followerRef, true)
        .then(() => set(followingRef, true))
        .then(() => setIsFollowing(true))
        .catch((error) => console.error("Follow Error:", error));
    }
  };

  // Show skeleton while loading
  if (!profileUserData) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <div className="flex items-start space-x-10">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-pink-500 via-yellow-500 to-purple-600 p-[3px]">
          <div className="w-full h-full rounded-full bg-white p-[3px]">
            <div className="w-full h-full rounded-full overflow-hidden relative">
              <img
                src={
                  profileUserData?.imgUrl ||
                  "https://images.pexels.com/photos/2297927/pexels-photo-2297927.jpeg"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-xl font-semibold">
              {profileUserData?.fullName || "User"}
            </h2>
            {currentUser?.userId === userId ? (
              <button
                onClick={() => navigate(`/setting`)}
                className="px-3 py-1 border cursor-pointer rounded text-sm font-medium"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleFollowToggle}
                  className={`px-3 py-1 border cursor-pointer rounded text-sm font-medium ${
                    isFollowing ? "bg-gray-200 text-black" : ""
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
                <button
                  onClick={() => navigate(`/message`)}
                  className="px-3 py-1 border cursor-pointer rounded text-sm font-medium"
                >
                  Message
                </button>
              </>
            )}
          </div>
          <div className="-mt-2.5">
            <h2>@{profileUserData?.username}</h2>
          </div>
          <div className="flex gap-6 text-sm mt-2.5 mb-1">
            <span>
              <span className="font-bold">{profileUserPost?.length || 0}</span>{" "}
              posts
            </span>
            <span>
              <span className="font-bold">{followersCount}</span> followers
            </span>
            <span>
              <span className="font-bold">{followingCount}</span> following
            </span>
          </div>

          <div className="font-medium text-sm">
            <div className="flex gap-4 mt-2 text-xl">
              {profileUserData?.socialHandles?.facebook?.url && (
                <a
                  href={profileUserData.socialHandles.facebook.url}
                  target="_blank"
                >
                  <FaFacebookF className="text-[#1877F2] hover:scale-110 transition-transform cursor-pointer" />
                </a>
              )}
              {profileUserData?.socialHandles?.linkedin?.url && (
                <a
                  href={profileUserData.socialHandles.linkedin.url}
                  target="_blank"
                >
                  <FaLinkedinIn className="text-[#0A66C2] hover:scale-110 transition-transform cursor-pointer" />
                </a>
              )}
              {profileUserData?.socialHandles?.twitter?.url && (
                <a
                  href={profileUserData.socialHandles.twitter.url}
                  target="_blank"
                >
                  <FaXTwitter className="text-black hover:scale-110 transition-transform cursor-pointer" />
                </a>
              )}
              {profileUserData?.socialHandles?.whatsapp?.url && (
                <a
                  href={profileUserData.socialHandles.whatsapp.url}
                  target="_blank"
                >
                  <FaWhatsapp className="text-[#25D366] hover:scale-110 transition-transform cursor-pointer" />
                </a>
              )}
            </div>
          </div>
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
          <span>Posts</span>
        </div>

        {currentUser?.userId === userId && (
          <div
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-2 px-4 py-2 cursor-pointer ${
              activeTab === "saved"
                ? "text-black border-t-2 border-black font-bold"
                : "text-gray-500"
            }`}
          >
            <BsBookmark />
            <span>Saved</span>
          </div>
        )}

        {currentUser?.userId !== userId && (
          <div
            onClick={() => setActiveTab("video")}
            className={`flex items-center gap-2 px-4 py-2 cursor-pointer ${
              activeTab === "video"
                ? "text-black border-t-2 border-black font-bold"
                : "text-gray-500"
            }`}
          >
            <RiFolderVideoFill />
            <span>Videos</span>
          </div>
        )}
      </div>

      {/* Posts Tab */}
      {activeTab === "posts" && (
        <div className="flex flex-wrap -m-1 mt-4">
          {profileUserPost
            .filter((post) => post?.imgUrls && post.imgUrls.length > 0) //only show that post there hane any image
            .reverse()
            .map((post, index) => (
              <div key={index} className="w-1/3 p-1">
                <div className="w-full aspect-[3/4] overflow-hidden rounded-md">
                  <img
                    src={post.imgUrls[0]}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Video Tab */}
      {activeTab === "video" && (
        <div className="flex flex-wrap -m-1 mt-4">
          {profileUserPost.filter((post) => post.videoUrl).length > 0 ? (
            profileUserPost
              .filter((post) => post.videoUrl)
              .map((post, index) => (
                <div key={index} className="w-1/3 p-1">
                  <div className="w-full aspect-[3/4] overflow-hidden rounded-md bg-black">
                    <video
                      src={post.videoUrl}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center w-full text-gray-500 mt-4">
              No videos found
            </p>
          )}
        </div>
      )}

      {/* Saved Posts Tab */}
      {activeTab === "saved" && (
        <div className="flex flex-wrap -m-1 mt-4">
          {savedPosts.length > 0 ? (
            savedPosts.map((post, index) => (
              <div key={index} className="w-1/3 p-1">
                <div className="w-full aspect-[3/4] overflow-hidden rounded-md">
                  <img
                    src={post?.imgUrls?.[0]}
                    alt="Saved Post"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-center w-full text-gray-500 mt-4">
              No saved posts found
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
