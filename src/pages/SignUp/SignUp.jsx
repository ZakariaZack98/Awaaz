import React, { useState } from "react";
import { auth } from "../../../Database/Firebase.config";
import { Facebook, Mail, Lock } from 'lucide-react';
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

import { useNavigate } from "react-router-dom";
import { handlefacebook, handlegoogle } from "../../utils/Signupsignin.utils";
import { toast } from "react-toastify";

const SignUp = () => {
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [profilePic, setProfilePic] = useState("https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png");
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!profilePic) return null;
    setUploading(true);
    const data = new FormData();
    data.append("file", profilePic);
    data.append("upload_preset", "awaaz_app"); // Replace with your Cloudinary upload preset
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/dubcsgtfg/image/upload`, {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      setUploading(false);
      return result.secure_url;

    } catch (err) {
      console.error("Error uploading image:", err);
      setUploading(false);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    let profilePicUrl = " ";
    if (profilePic) {
      profilePicUrl = await uploadImageToCloudinary();
      if (!profilePicUrl) {
        alert("Image upload failed!");
        return;
      }
    }

    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userInfo) => {
        sendEmailVerification(auth.currentUser);
        // Update User in Auth
        updateProfile(auth.currentUser, {
          displayName: formData.fullName,
          photoURL: profilePicUrl,
        })
      })
      .then(() => {
        // Store User data in database
        set(ref(db, `users/${auth.currentUser.uid}`), {
          userId: auth?.currentUser?.uid,
          username: formData.username,
          email: auth.currentUser.email || formData.email,
          imgUrl: auth?.currentUser?.photoURL || profilePicUrl,
          fullName: auth.currentUser.displayName || formData.fullName,
          activePosts: 0
        });
        toast.success("User create succesfully");
        navigate("/")
      })
      .catch((error) => {
        console.log("Create user in DB error", error);
        alert(error)
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-5">
      <div className="bg-white p-6 w-full max-w-md rounded-md shadow-md border border-gray-200">
        <h2 className="text-5xl text-center font-semibold  mb-6  text-red-800 cookie">Awaaz</h2>
        <div className="space-y-3 mb-4">
          {/* Social Sign In Options */}
          <div className="space-y-4 mb-6">
            <button onClick={() => handlefacebook(navigate)} className="flex items-center justify-center w-full bg-blue-500 text-white py-2 px-4 rounded font-medium hover:bg-blue-600 transition duration-200 cursor-pointer">
              <Facebook size={20} className="mr-2" />
              Continue with Facebook
            </button>

            <button onClick={() => handlegoogle(navigate)} className="flex items-center justify-center w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded font-medium hover:bg-gray-50 transition duration-200 cursor-pointer">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                />
                <path
                  fill="#34A853"
                  d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
                />
                <path
                  fill="#4A90E2"
                  d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                />
              </svg>
              Continue with Google
            </button>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-gray-400 text-sm">or sign up with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="text-left">
            <label htmlFor="profilePic" className="block text-sm text-gray-600 mb-1">
              Profile Picture
            </label>
            <input
              type="file"
              id="profilePic"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-20 h-20 rounded-full object-cover border border-gray-300"
              />
            )}
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="w-full p-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 disabled:opacity-50">
            {uploading ? "Uploading..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
