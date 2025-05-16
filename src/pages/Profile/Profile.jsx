import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { BiGridAlt } from "react-icons/bi";
import { BsBookmark } from "react-icons/bs";
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

const Profile = () => {
  const { userId } = useParams();
  const [profileUserData, setProfileUserData] = useState(null);
  const [profileUserPost, setProfileUserPost] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const { currentUser } = useContext(DataContext);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  // todo: for chacking the user is follower or not
  useEffect(() => {
    if (!currentUser?.userId || !userId) return;

    const followRef = ref(db, `followers/${userId}/${currentUser.userId}`);
    onValue(followRef, (snapshot) => {
      setIsFollowing(snapshot.exists());
    });
  }, [currentUser?.userId, userId]);

  // todo: Profileuser followers fetch from db
  useEffect(() => {
    if (!userId) return;

    const followersRef = ref(db, `followers/${userId}`);
    onValue(followersRef, (snapshot) => {
      if (snapshot.exists()) {
        const count = Object.keys(snapshot.val()).length; //Object.keys method gives a array using objects all key
        setFollowersCount(count);
      } else {
        setFollowersCount(0);
      }
    });
  }, [userId]);
  // todo: Profileuser following fetch from db
  useEffect(() => {
    if (!userId) return;

    const followersRef = ref(db, `followings/${userId}`);
    onValue(followersRef, (snapshot) => {
      if (snapshot.exists()) {
        const count = Object.keys(snapshot.val()).length; //Object.keys method gives a array using objects all key
        setFollowingCount(count);
      } else {
        setFollowingCount(0);
      }
    });
  }, [userId]);

  // todo: Profileuser fetch from db
  useEffect(() => {
    if (!userId) return;

    const userRef = ref(db, `users/${userId}`);
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setProfileUserData(snapshot.val());
      }
    });
    // todo: Profileuser post fetch from db
    const postsQuery = query(
      ref(db, "posts"),
      orderByChild("posterId"),
      equalTo(userId)
    );

    onValue(postsQuery, (snapshot) => {
      if (snapshot.exists()) {
        const postsArray = Object.values(snapshot.val());
        setProfileUserPost(postsArray);
      } else {
        setProfileUserPost([]);
      }
    });
  }, [userId]);

  // todo: handleFollowToggle function for follow and unfollow
  const handleFollowToggle = () => {
    if (!currentUser?.userId || !userId) return;

    const followerRef = ref(db, `followers/${userId}/${currentUser.userId}`);
    const followingRef = ref(db, `followings/${currentUser.userId}/${userId}`);

    if (isFollowing) {
      //  Unfollow: remove both
      remove(followerRef)
        .then(() => remove(followingRef))
        .then(() => setIsFollowing(false))
        .catch((error) => console.error("unfollow Error:", error));
    } else {
      //  Follow: add both
      set(followerRef, true)
        .then(() => set(followingRef, true))
        .then(() => setIsFollowing(true))
        .catch((error) => console.error("follow Error:", error));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <div className="flex items-start space-x-10">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-pink-500 via-yellow-400 to-purple-600 p-[3px]">
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
              <div className="absolute top-0 left-0 w-full h-full  rounded-full" />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-xl font-semibold">
              {profileUserData?.fullName || "User"}
            </h2>
            {currentUser?.userId === userId && (
              <button
                onClick={() => navigate(`/setting`)}
                className="px-3 py-1 border cursor-pointer rounded text-sm font-medium"
              >
                Edit profile
              </button>
            )}
            {currentUser?.userId !== userId && (
              <button
                onClick={handleFollowToggle}
                className={`px-3 py-1 border cursor-pointer rounded text-sm font-medium ${
                  isFollowing ? "bg-gray-200 text-black" : ""
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}

            {currentUser?.userId !== userId && (
              <button
                onClick={() => navigate(`/message`)}
                className="px-3 py-1 border cursor-pointer rounded text-sm font-medium"
              >
                Message
              </button>
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

          {/* Social Media Icons */}
          <div className="font-medium text-sm">
            <div className="flex gap-4 mt-2 text-xl">
              <a
                href="#"
                className="text-[#1877F2] hover:scale-110 transition-transform"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="text-[#0A66C2] hover:scale-110 transition-transform"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="#"
                className="text-black hover:scale-110 transition-transform"
              >
                <FaXTwitter />
              </a>
              <a
                href="#"
                className="text-[#25D366] hover:scale-110 transition-transform"
              >
                <FaWhatsapp />
              </a>
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
            <span>SAVED</span>
          </div>
        )}
      </div>

      {/* Posts */}
      {activeTab === "posts" && (
        <div className="flex flex-wrap -m-1 mt-4">
          {profileUserPost
            .slice()
            .reverse() // .slice().reverse() for latest post
            .reverse()
            .map((post, index) => (
              <div key={index} className="w-1/3 p-1">
                <div className="w-full aspect-[3/4] overflow-hidden rounded-md">
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

      {/* Saved */}
      {activeTab === "saved" && currentUser?.userId === userId && (
        <div className="flex flex-wrap -m-1 mt-4">
          {profileUserPost.map((post, index) => (
            <div key={index} className="w-1/3 p-1">
              <div className="w-full aspect-[3/4] overflow-hidden rounded-md">
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

export default Profile;
