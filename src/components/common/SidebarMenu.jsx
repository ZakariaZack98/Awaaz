import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSettings,
  FiBookmark,
  FiSun,
  FiAlertCircle,
  FiLogOut,
} from "react-icons/fi";
import { signOut } from "firebase/auth";
import { auth } from "../../../Database/Firebase.config";

const SidebarMenu = ({ setShowSidebarMenu }) => {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowSidebarMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowSidebarMenu]);

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/signin");
        console.log("User signed out.");
      })
      .catch((error) => {
        console.error("Sign-out error:", error);
      });
  };

  const menuItems = [
    { label: "Settings", icon: <FiSettings />, path: "/settings" },
    { label: "Saved", icon: <FiBookmark />, path: `/profile/${auth.currentUser?.uid}/saved` },
    { label: "Switch appearance", icon: <FiSun />, path: "/appearance" },
    { label: "Report a problem", icon: <FiAlertCircle />, path: "/report" },
    { label: "Log out", icon: <FiLogOut />, path: "logout" },
  ];

  return (
    <div
      ref={menuRef}
      style={{ boxShadow: "0 0 5px 5px rgba(0,0,0,0.1)" }}
      className="w-56 bg-white rounded-xl p-2 space-y-1"
    >
      {menuItems.map((item, index) => (
        <div
          key={index}
          onClick={() => {
            if (item.label === "Log out") {
              handleLogOut();
            } else {
              navigate(item.path);
            }
            setShowSidebarMenu(false);
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
