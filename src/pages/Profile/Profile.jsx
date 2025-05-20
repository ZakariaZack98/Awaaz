import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { BiGridAlt } from "react-icons/bi";
import { BsBookmark } from "react-icons/bs";
import { RiFolderVideoFill } from "react-icons/ri";
import {
  get,
  ref,
  query,
  orderByChild,
  equalTo
} from "firebase/database";
import { db } from "../../../Database/Firebase.config";
import { DataContext } from "../../contexts/DataContexts";
import ProfileSkeleton from "../../components/Skeleton/ProfileSkeleton";
import { Follow, Unfollow } from "../../utils/actions.utils";

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(DataContext);
  const [profileUserData, setProfileUserData] = useState(null);
  const [profileUserPost, setProfileUserPost] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);

  // TODO: FETCH ALL NECESSARY DATA TO RENDER PROFILE
  useEffect(() => {
    if (!userId) return;
    const fetchProfileData = async () => {
      try {
        const [
          userSnap,
          postsSnap,
          followersSnap,
          followingSnap,
          followStatusSnap
        ] = await Promise.all([
          get(ref(db, `users/${userId}`)),
          get(query(ref(db, "posts"), orderByChild("posterId"), equalTo(userId))),
          get(ref(db, `followers/${userId}`)),
          get(ref(db, `followings/${userId}`)),
          currentUser?.userId
            ? get(ref(db, `followers/${userId}/${currentUser.userId}`))
            : Promise.resolve(null)
        ]);

        setProfileUserData(userSnap.exists() ? userSnap.val() : null);
        setProfileUserPost(postsSnap.exists() ? Object.values(postsSnap.val()) : []);
        setFollowersCount(followersSnap.exists() ? Object.keys(followersSnap.val()).length : 0);
        setFollowingCount(followingSnap.exists() ? Object.keys(followingSnap.val()).length : 0);
        setIsFollowing(followStatusSnap && followStatusSnap.exists());
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfileData();
  }, [userId, currentUser?.userId]);

  // TODO: FETCH DATA FOR SAVED TAB IF SAVED TAB IS ACTIVE
  useEffect(() => {
    if (activeTab !== "saved" || !userId) return;
    const fetchSavedPosts = async () => {
      try {
        const savedSnap = await get(ref(db, `savedPosts/${userId}`));
        if (savedSnap.exists()) {
          const savedKeys = Object.keys(savedSnap.val());
          const allPostsSnap = await get(ref(db, "posts"));
          if (allPostsSnap.exists()) {
            const allPosts = allPostsSnap.val();
            const filtered = savedKeys.map((key) => allPosts[key]).filter(Boolean);
            setSavedPosts(filtered);
          }
        } else {
          setSavedPosts([]);
        }
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      }
    };
    fetchSavedPosts();
  }, [activeTab, userId]);

  // TODO: HANDLE FOLLOW/UNFOLLOW PROFILE
  const handleFollowToggle = async () => {
    if (!currentUser?.userId || !userId) return;
    try {
      if (isFollowing) {
        await Unfollow(userId);
        setFollowersCount(followersCount - 1 || 0)
        setIsFollowing(false);
      } else {
        await Follow(userId);
        setFollowersCount(followersCount + 1)
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Follow/Unfollow Error:", error);
    }
  };

  if (!profileUserData) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 h-screen overflow-hidden" style={{ scrollbarWidth: "none" }}>
      {/* Profile Header */}
      <div className="flex items-start pt-10">
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
        <div className="flex flex-col ms-5">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-xl font-semibold">
              {profileUserData?.fullName || "User"}
            </h2>
            {currentUser?.userId === userId ? (
              <button
                onClick={() => navigate(`/settings`)}
                className="px-3 py-1 border cursor-pointer rounded text-sm font-medium"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleFollowToggle}
                  className={`px-3 py-1 border cursor-pointer rounded text-sm font-medium ${isFollowing ? "bg-gray-200 text-black" : ""
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
                  rel="noreferrer"
                >
                  <FaFacebookF className="text-[#1877F2] hover:scale-110 transition-transform cursor-pointer" />
                </a>
              )}
              {profileUserData?.socialHandles?.linkedin?.url && (
                <a
                  href={profileUserData.socialHandles.linkedin.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaLinkedinIn className="text-[#0A66C2] hover:scale-110 transition-transform cursor-pointer" />
                </a>
              )}
              {profileUserData?.socialHandles?.twitter?.url && (
                <a
                  href={profileUserData.socialHandles.twitter.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaXTwitter className="text-black hover:scale-110 transition-transform cursor-pointer" />
                </a>
              )}
              {profileUserData?.socialHandles?.whatsapp?.url && (
                <a
                  href={profileUserData.socialHandles.whatsapp.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaWhatsapp className="text-[#25D366] hover:scale-110 transition-transform cursor-pointer" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-t mt-6 text-sm font-medium">
        <div
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-2 px-2 py-1 cursor-pointer ${activeTab === "posts"
            ? "text-black border-t-2 border-black font-bold"
            : "text-gray-500"
            }`}
        >
          <BiGridAlt />
          <span>Posts</span>
        </div>

        <div
          onClick={() => setActiveTab("video")}
          className={`flex items-center gap-2 px-4 py-2 cursor-pointer ${activeTab === "video"
            ? "text-black border-t-2 border-black font-bold"
            : "text-gray-500"
            }`}
        >
          <RiFolderVideoFill />
          <span>Videos</span>
        </div>

        {currentUser?.userId === userId && (
          <div
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-2 px-4 py-2 cursor-pointer ${activeTab === "saved"
              ? "text-black border-t-2 border-black font-bold"
              : "text-gray-500"
              }`}
          >
            <BsBookmark />
            <span>Saved</span>
          </div>
        )}
      </div>

      <div
        className="relative h-[75vh] overflow-y-scroll mt-4"
        style={{ scrollbarWidth: "none" }}
      >
        {activeTab === "posts" && (
          <div className="flex flex-wrap -m-1">
            {profileUserPost
              .filter((post) => post?.imgUrls && post.imgUrls.length > 0)
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

        {activeTab === "video" && (
          <div className="flex flex-wrap -m-1">
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
              <p className="text-center w-full text-gray-500 mt-4">No videos found</p>
            )}
          </div>
        )}
        {activeTab === "saved" && (
          <div className="flex flex-wrap -m-1">
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
              <p className="text-center w-full text-gray-500 mt-4">No saved posts found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
