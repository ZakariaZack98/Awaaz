import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSettings,
  FiActivity,
  FiBookmark,
  FiSun,
  FiAlertCircle,
  FiLogOut,
  FiRepeat,
  FiUser,
} from "react-icons/fi";
import { FaThreads } from "react-icons/fa6";
import { signOut } from "firebase/auth";
import { auth } from "../../../Database/Firebase.config";

const SidebarMenu = () => {
  // todo handleLogOut function apply
  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("signin");
        console.log("User signed out.");
      })
      .catch((error) => {
        // An error happened.
        console.error("Sign-out error:", error);
      });
  };
  const menuItems = [
    { label: "Settings", icon: <FiSettings />, path: "/settings" },
    { label: "Your activity", icon: <FiActivity />, path: "/activity" },
    { label: "Saved", icon: <FiBookmark />, path: "/saved" },
    { label: "Switch appearance", icon: <FiSun />, path: "/appearance" },
    { label: "Report a problem", icon: <FiAlertCircle />, path: "/report" },
    { label: "Threads", icon: <FaThreads />, path: "/threads" },
    { label: "Switch accounts", icon: <FiUser />, path: "/switch-accounts" },
    { label: "Log out", icon: <FiLogOut />, path: "logout" },
  ];
  const navigate = useNavigate();

  return (
    <div
      style={{ boxShadow: "0 0 5px 5px rgba(0,0,0,0.1)" }}
      className="w-56 bg-white  rounded-xl p-2 space-y-1"
    >
      {menuItems.map((item, index) => (
        <div
          key={index}
          onClick={() => {
            if (item.label === "Log out") {
              handleLogOut(); // ✅ এখানে সঠিকভাবে ফাংশন কল করা হয়েছে
            } else {
              navigate(item.path); // ✅ path ব্যবহার করা হয়েছে ঠিকভাবে
            }
          }}
          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-all"
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-sm font-medium">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default SidebarMenu;
