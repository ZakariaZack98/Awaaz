import React, { useEffect, useState } from "react";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth, updateProfile } from "firebase/auth";
import { FiEdit } from "react-icons/fi";
import { IoMdDoneAll } from "react-icons/io";
import {
  FaFacebookSquare,
  FaInstagram,
  FaLinkedin,
  FaLock,
  FaYoutube,
} from "react-icons/fa";
import { FaCircleMinus, FaCirclePlus, FaXTwitter } from "react-icons/fa6";
import { toast } from "react-toastify";
import SettingSkeleton from "../../components/Skeleton/SettingSkeleton";
import { DataContext } from "../../contexts/DataContexts";
import { useContext } from "react";
import AddSocialPrompt from "../../components/Settings/AddSocialPrompt";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { ImUnlocked } from "react-icons/im";

const Settings = () => {
  const db = getDatabase();
  const auth = getAuth();
  const { currentUser } = useContext(DataContext);

  // State for handle edited profile. also updaet & hold fetch data
  const [fullname, setFullname] = useState(currentUser?.fullName || "Name missing");
  const [editFullname, seteditFullname] = useState(false);
  const [profilePicUpdateUrl, setProfilePicUpdateUrl] = useState(currentUser?.imgUrl);
  const [theme, setTheme] = useState(currentUser?.defaultTheme || "Light");
  const [followersVisibility, setFollowersVisibility] = useState(currentUser?.followersVisibility || "Public");
  const [followingVisibility, setFollowingVisibility] = useState(currentUser?.followingVisibility || "Public");
  const [profileVisibility, setProfileVisibility] = useState(currentUser?.isLocked || false);
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [gender, setGender] = useState(currentUser?.gender || "Unselected");

  // State for Social handle
  const [socialHandelsVisibility, setSocialHandelsVisibility] = useState(false);
  const [socialHandels, setSocialHandels] = useState(currentUser?.socialHandles || {});
  const [socialLink, setSocialLink] = useState("");

  // Update profile picture
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "awaaz_app");
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dubcsgtfg/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const result = await res.json();
      setProfilePicUpdateUrl(result.secure_url);
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  const handleUpdateUser = () => {
    toast.info("Updating Profile");
    set(ref(db, `users/${auth.currentUser.uid}`), {
      userId: auth.currentUser.uid,
      username: currentUser.username,
      fullName: fullname || "Set name",
      email: currentUser.email,
      imgUrl: profilePicUpdateUrl,
      gender: gender,
      bio: bio,
      defaultTheme: theme,
      isLocked: profileVisibility,
      followersVisibility: followersVisibility,
      followingVisibility: followingVisibility,
      socialHandles: socialHandels,
      // {
      //     facebook: { name: "Facebook", url: "https://fb.com/xyz" },
      //     twitter: { name: "Twitter", url: "https://twitter.com/xyz" },
      // }
    }).then(() => {
      // Update auth
      updateProfile(auth.currentUser, {
        displayName: fullname,
        photoURL: profilePicUpdateUrl,
      })
    })
      .then(() => {
        setSocialLink("");
        toast.success("Profile is updated");
      })
      .catch((err) => {
        console.log("user update error", err);
      });
  };

  return (
    <>
      {currentUser ? (
        <div className="h-full overflow-hidden">
          <div
            className="max-w-xl h-full mx-auto p-6 overflow-y-scroll 50"
            style={{ scrollbarWidth: "none" }}
          >
            <h1 className="text-2xl font-semibold mb-6">Edit profile</h1>
            <div className="flex items-center gap-4 mb-6">
              <img
                src={profilePicUpdateUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-x-2">
                  {editFullname ? (
                    <input
                      type="text"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      className="border py-1 px-2 rounded w-[180px]"
                    />
                  ) : (
                    <input
                      type="text"
                      value={fullname}
                      className="py-1 rounded w-[180px]"
                      disabled
                    />
                  )}
                  {editFullname ? (
                    <IoMdDoneAll
                      onClick={() => seteditFullname(!editFullname)}
                      className="text-black hover:text-blue-600 cursor-pointer"
                    />
                  ) : (
                    <FiEdit
                      onClick={() => seteditFullname(!editFullname)}
                      className="text-gray-500 hover:text-blue-500 cursor-pointer"
                    />
                  )}
                </div>

                <div className="inline-block">
                  <div className="">
                    <label
                      htmlFor="upload"
                      className="  text-blue-800 cursor-pointer"
                    >
                      Change photo
                    </label>
                    <input
                      type="file"
                      multiple
                      id="upload"
                      name="upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
            </div>


            {/* ProfileVisibility */}
            <div className="space-y-3">
              <div >
                <label className="block font-medium mb-1">
                  Profile Visibility
                </label>
                <div className="flex justify-between border border-gray-300 rounded-md p-2">
                  <label className="block font-medium mb-1">
                    Switch to {profileVisibility ? "Unlocked" : "Locked"}
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={profileVisibility}
                      onChange={() =>
                        setProfileVisibility(!profileVisibility)
                      }
                    />
                    <div className="w-11 h-6 rounded-full relative bg bg-blue-400">
                      <div
                        className={`absolute flex justify-center items-center top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition ${profileVisibility ? "translate-x-5" : ""
                          }`}
                      >{profileVisibility ? <FaLock className="text-black p-[1px]" /> : <ImUnlocked className="text-black p-[1px]" />
                        }</div>
                    </div>
                  </label>
                </div>
              </div>
              {/* ProfileVisibility */}

              {/* Follower / Following Visibility Section (Select dropdown) */}
              <div>
                <label className="block font-medium mb-1">
                  Followers Visibility
                </label>
                <select
                  value={followersVisibility}
                  onChange={(e) => setFollowersVisibility(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Following Visibility
                </label>
                <select
                  value={followingVisibility}
                  onChange={(e) => setFollowingVisibility(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </div>

              {/* Social Handles Section control by button */}

              <button
                onClick={() =>
                  setSocialHandelsVisibility(!socialHandelsVisibility)
                }
                className="flex items-center gap-x-2 text-black mb-2 cursor-pointer rounded"
              >
                {socialHandelsVisibility ? <FaCircleMinus /> : <FaCirclePlus />}Social Links
              </button>
              {socialHandelsVisibility && (
                <AddSocialPrompt setSocialHandels={setSocialHandels}
                  setSocialLink={setSocialLink}
                  socialLink={socialLink} />
              )}
              {/* social handle links */}

              <div className="flex flex-col">
                {socialHandels &&
                  Object.keys(socialHandels).length > 0 &&
                  Object.values(socialHandels)?.map(({ name, url }) => (
                    <div className="flex items-center gap-x-1">
                      {name == "Facebook" ? (
                        <FaFacebookSquare className="text-blue-500" />
                      ) : name == "X (Twitter)" ? (
                        <FaXTwitter className="text-black" />
                      ) : name == "YouTube" ? (
                        <FaYoutube className="text-red-500" />
                      ) : name == "Instagram" ? (
                        <FaInstagram />
                      ) : name == "LinkedIn" ? (
                        <FaLinkedin />
                      ) : (
                        "Not Implement"
                      )}
                      <a
                        className="text-blue-500 cursor-pointer"
                        target="_blank"
                        href={url}
                      >
                        {url}
                      </a>
                    </div>
                  ))}
              </div>

              {/* Bio Section */}
              <div>
                <label className="block font-medium mb-1">Bio</label>
                <textarea
                  placeholder="Bio"
                  maxLength={160}
                  onChange={(e) => setBio(e.target.value)}
                  value={bio}
                  className="w-full border border-gray-300 rounded-md p-2 h-24 focus:ring focus:ring-blue-300"
                ></textarea>
              </div>

              {/* Gender */}
              <div>
                <label className="block font-medium mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
                >
                  <option value={"Male"}>Male</option>
                  <option value={"Female"}>Female</option>
                  <option value={"Unselected"}>Unselected</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  This won’t be part of your public profile.
                </p>
              </div>

              {/* Show Suggestions Toggle */}
              <div className="flex justify-between border border-gray-300 rounded-md p-2">
                <label className="block font-medium mb-1">
                  Switch to {theme == "Light" ? "Dark" : "Light"}
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={theme}
                    onChange={() =>
                      setTheme(theme == "Light" ? "Dark" : "Light")
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full relative bg peer-checked:bg-blue-400">
                    <div
                      className={`absolute flex justify-center items-center top-0.5 left-0.5 w-5 h-5   rounded-full transition ${theme == "Dark" ? "translate-x-5 bg-black" : "bg-white"
                        }`}
                    >{theme == "Light" ? <MdLightMode className="text-black" /> : <MdDarkMode className="text-white" />
                      }</div>
                  </div>
                </label>
              </div>
            </div>
            <button
              onClick={handleUpdateUser}
              className="w-full mt-6 bg-blue-500 text-white rounded-md py-2 font-medium hover:bg-blue-600 cursor-pointer"
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <SettingSkeleton />
      )}
    </>
  );
};

export default Settings;
