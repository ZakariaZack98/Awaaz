import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { BiGridAlt } from "react-icons/bi";
import { BsBookmark } from "react-icons/bs";
import { RiFolderVideoFill } from "react-icons/ri";
import { get, ref, query, orderByChild, equalTo } from "firebase/database";
import { auth, db } from "../../../Database/Firebase.config";
import { DataContext } from "../../contexts/DataContexts";
import ProfileSkeleton from "../../components/Skeleton/ProfileSkeleton";
import { Follow, Unfollow } from "../../utils/actions.utils";
import PostThumbnail from "../../components/common/PostThumbnail";
import { FetchLikesCommentsCount } from "../../utils/fetchData.utils";
import Post from "../../pages/Post/Post";
import FSUserList from "../../components/common/FSUserList";

const Profile = ({ defaultTab = "posts" }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(DataContext);
  const [profileUserData, setProfileUserData] = useState(null);
  const [profileUserPost, setProfileUserPost] = useState([]);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);
  const [showFollowersList, setShowFollowersList] = useState(false);
  const [showFollowingsList, setShowFollowingsList] = useState(false);

  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isPostOpen, setIsPostOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchProfileData = async () => {
      try {
        const [
          userSnap,
          postsSnap,
          followersSnap,
          followingSnap,
          followStatusSnap,
        ] = await Promise.all([
          get(ref(db, `users/${userId}`)),
          get(
            query(ref(db, "posts"), orderByChild("posterId"), equalTo(userId))
          ),
          get(ref(db, `followers/${userId}`)),
          get(ref(db, `followings/${userId}`)),
          currentUser?.userId
            ? get(ref(db, `followers/${userId}/${currentUser.userId}`))
            : Promise.resolve(null),
        ]);

        setProfileUserData(userSnap.exists() ? userSnap.val() : null);

        if (postsSnap.exists()) {
          const postsData = postsSnap.val();

          // For each post, fetch likes and comments count
          const postsWithCounts = await Promise.all(
            Object.entries(postsData).map(async ([postId, post]) => {
              const [likesCount, commentsCount] = await FetchLikesCommentsCount(
                postId
              );
              return {
                ...post,
                id: postId,
                likesCount: likesCount,
                commentsCount: commentsCount,
              };
            })
          );

          setProfileUserPost(postsWithCounts);
        } else {
          setProfileUserPost([]);
        }

        setFollowersCount(
          followersSnap.exists() ? Object.keys(followersSnap.val()).length : 0
        );
        setFollowingCount(
          followingSnap.exists() ? Object.keys(followingSnap.val()).length : 0
        );
        setIsFollowing(followStatusSnap && followStatusSnap.exists());
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [userId, currentUser?.userId]);

  useEffect(() => {
    if (activeTab !== "saved" || !userId) return;
    if (userId !== auth.currentUser.uid) {
      navigate("/accessdenied");
      return;
    }
    const fetchSavedPosts = async () => {
      try {
        const savedSnap = await get(ref(db, `savedPosts/${userId}`));
        if (savedSnap.exists()) {
          const savedKeys = Object.keys(savedSnap.val());
          const allPostsSnap = await get(ref(db, "posts"));
          if (allPostsSnap.exists()) {
            const allPosts = allPostsSnap.val();

            const filtered = await Promise.all(
              savedKeys.map(async (key) => {
                const post = allPosts[key];
                if (!post) return null;

                const [likesCount, commentsCount] =
                  await FetchLikesCommentsCount(key);

                return {
                  ...post,
                  id: key,
                  likesCount,
                  commentsCount,
                };
              })
            );

            setSavedPosts(filtered.filter(Boolean));
          } else {
            setSavedPosts([]);
          }
        } else {
          setSavedPosts([]);
        }
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      }
    };

    fetchSavedPosts();
  }, [activeTab, userId, navigate]);

  const handleFollowToggle = async () => {
    if (!currentUser?.userId || !userId) return;
    try {
      if (isFollowing) {
        await Unfollow(userId);
        setFollowersCount((count) => (count > 0 ? count - 1 : 0));
        setIsFollowing(false);
      } else {
        await Follow(userId);
        setFollowersCount((count) => count + 1);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Follow/Unfollow Error:", error);
    }
  };

  if (!profileUserData) {
    return <ProfileSkeleton />;
  }
  // todo: handlePostClick for post page open
  const handlePostClick = (postId) => {
    setSelectedPostId(postId);
    setIsPostOpen(true);
  };
  return (
    <div className="max-w-4xl mx-auto p-4 h-screen overflow-y-auto custom-scrollbar">
      {showFollowersList && (
        <FSUserList
          initialHeading="followers"
          userId={profileUserData.userId}
          setShowUserList={setShowFollowersList}
        />
      )}
      {showFollowingsList && (
        <FSUserList
          initialHeading="followings"
          userId={profileUserData.userId}
          setShowUserList={setShowFollowingsList}
        />
      )}
      {/* Profile Header */}
      <div className="flex items-start pt-5">
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
            <span
              className="cursor-pointer"
              onClick={() => setShowFollowersList(true)}
            >
              <span className="font-bold">{followersCount}</span> followers
            </span>
            <span
              className="cursor-pointer"
              onClick={() => setShowFollowingsList(true)}
            >
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
          className={`flex items-center gap-2 px-2 py-1 cursor-pointer ${
            activeTab === "posts"
              ? "text-black border-t-2 border-black font-bold"
              : "text-gray-500"
          }`}
        >
          <BiGridAlt />
          <span>Posts</span>
        </div>

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
      </div>

      <div className="relative mt-4">
        {activeTab === "posts" && (
          <div className="flex flex-wrap -m-1">
            {profileUserPost
              .filter((post) => !post.videoUrl)
              .reverse()
              .map((post, index) => {
                const isTextPost = !post.imgUrls || post.imgUrls.length === 0;
                return (
                  <PostThumbnail
                    key={post.id || index}
                    onClick={() => handlePostClick(post.id)}
                    type={isTextPost ? "text" : "image"}
                    src={!isTextPost ? post.imgUrls[0] : ""}
                    likes={post.likesCount || 0}
                    comments={post.commentsCount || 0}
                    caption={post.text || ""}
                    text={post.text || ""}
                    hasMultipleImages={!isTextPost && post.imgUrls.length > 1}
                    user={{
                      name: profileUserData?.fullName,
                      username: profileUserData?.username,
                      profileImage: profileUserData?.imgUrl,
                    }}
                  />
                );
              })}
          </div>
        )}

        {activeTab === "video" && (
          <div className="flex flex-wrap -m-1">
            {profileUserPost.filter((post) => post.videoUrl).length > 0 ? (
              profileUserPost
                .filter((post) => post.videoUrl)
                .map((post, index) => (
                  <PostThumbnail
                    onClick={() => handlePostClick(post.id)}
                    key={post.id || index}
                    type="video"
                    src={post.videoUrl}
                    likes={post.likesCount || 0}
                    comments={post.commentsCount || 0}
                    caption={post.caption || ""}
                    user={{
                      name: profileUserData?.fullName,
                      username: profileUserData?.username,
                      profileImage: profileUserData?.imgUrl,
                    }}
                  />
                ))
            ) : (
              <p className="text-center w-full text-gray-500 mt-4">
                No videos found
              </p>
            )}
          </div>
        )}

        {activeTab === "saved" && (
          <div className="flex flex-wrap -m-1">
            {savedPosts.length > 0 ? (
              savedPosts.map((post, index) => {
                const isTextPost = !post.imgUrls || post.imgUrls.length === 0;
                const type = post.videoUrl
                  ? "video"
                  : isTextPost
                  ? "text"
                  : "image";

                return (
                  <PostThumbnail
                    onClick={() => handlePostClick(post.id)}
                    key={post.id || index}
                    type={type}
                    src={
                      post.videoUrl
                        ? post.videoUrl
                        : !isTextPost
                        ? post.imgUrls[0]
                        : ""
                    }
                    likes={post.likesCount || 0}
                    comments={post.commentsCount || 0}
                    caption={post.caption || ""}
                    text={post.text || ""}
                    hasMultipleImages={!isTextPost && post.imgUrls.length > 1}
                    user={{
                      name: profileUserData?.fullName,
                      username: profileUserData?.username,
                      profileImage: profileUserData?.imgUrl,
                    }}
                  />
                );
              })
            ) : (
              <p className="text-center w-full text-gray-500 mt-4">
                No saved posts found
              </p>
            )}
          </div>
        )}
      </div>
      {isPostOpen && (
        <div className="fixed inset-0 bg-black/60 z-1000 flex items-center justify-center">
          <Post postId={selectedPostId} setOpenPost={setIsPostOpen} />
        </div>
      )}
    </div>
  );
};

export default Profile;
