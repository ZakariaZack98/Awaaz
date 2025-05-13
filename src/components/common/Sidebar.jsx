import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ref, onValue, off } from "firebase/database";
import {
  AiFillHome,
  AiOutlineSearch,
  AiOutlineCompass,
  AiOutlineHeart,
  AiOutlinePlusSquare,
} from "react-icons/ai";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { FiSend } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { BiMenu } from "react-icons/bi";
import SidebarMenu from "./SidebarMenu";
import { auth } from "../../../Database/Firebase.config";
import { db } from "../../../Database/Firebase.config";

const Sidebar = () => {
  const location = useLocation();
  const [currentUseData, setCurrentUseData] = useState([]);
  const navigate = useNavigate();
  const [showSidebarMenu, setShowSidebarMenu] = useState(false);

  const navItems = [
    { label: "Home", icon: AiFillHome, path: "/" },
    { label: "Search", icon: AiOutlineSearch, path: "/search" },
    { label: "Explore", icon: AiOutlineCompass, path: "/explore" },
    { label: "Reels", icon: MdOutlineOndemandVideo, path: "/reels" },
    { label: "Messages", icon: FiSend, path: "/messages" },
    { label: "Notifications", icon: AiOutlineHeart, path: "/notifications" },
    { label: "Create", icon: AiOutlinePlusSquare, path: "/create" },
    { label: "Profile", icon: CgProfile, path: "/profile" },
    { label: "More", icon: BiMenu, path: "/more" },
  ];
  // useEffect(() => {
  //   const uid = auth.currentUser?.uid;
  //   if (!uid) return;
  //   const userRef = ref(db, `users/${uid}`);
  //   onValue(userRef, (snapshot) => {
  //     if (snapshot.exists()) {
  //       setCurrentUseData(snapshot.val());
  //     }
  //   });
  // }, []);
  // console.log(currentUseData);

  return (
    <div className="w-1/5 h-screen overflow-hidden p-5 border-r border-gray-300">
      <div className="w-64 h-full p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-10 ml-2 font-sans">Instagram</h1>

        <nav className="flex flex-col gap-2">
          {navItems.map(({ label, icon: Icon, path }, index) => {
            const isActive = location.pathname === path;
            const isLast = index === navItems.length - 1;

            return (
              <div
                key={label}
                onClick={() => {
                  if (isLast) {
                    setShowSidebarMenu((prev) => !prev);
                  } else {
                    navigate(path);
                  }
                }}
                className={`flex items-center gap-4 px-4 py-2 rounded-lg cursor-pointer transition-all
        ${isActive ? "font-semibold bg-gray-100" : "hover:bg-gray-100"}
        ${isLast ? "mt-8 relative" : ""}`}
              >
                <Icon size={24} />
                <span>{label}</span>
              </div>
            );
          })}
          {showSidebarMenu && (
            <div className="absolute z-1000">
              <SidebarMenu />
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
