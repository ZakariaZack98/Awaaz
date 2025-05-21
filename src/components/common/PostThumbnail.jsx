import { useRef, useEffect, useMemo } from "react";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { BiSolidMoviePlay } from "react-icons/bi";
import { FaClone } from "react-icons/fa"; // multiple image icon
import gsap from "gsap";

const PostThumbnail = ({
  type,
  src,
  text,
  caption = "",
  likes = 0,
  comments = 0,
  user = {},
  hasMultipleImages = false,
}) => {
  const mediaRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const el = mediaRef.current;

    gsap.set(el, { scale: 1 });

    const onEnter = () => {
      gsap.to(el, { scale: 1.08, duration: 0.4, ease: "power2.out" });
      if (type === "video" && videoRef.current) {
        videoRef.current.play();
      }
    };

    const onLeave = () => {
      gsap.to(el, { scale: 1, duration: 0.4, ease: "power2.out" });
      if (type === "video" && videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };

    const wrapper = el?.parentElement;
    if (wrapper) {
      wrapper.addEventListener("mouseenter", onEnter);
      wrapper.addEventListener("mouseleave", onLeave);
    }

    return () => {
      if (wrapper) {
        wrapper.removeEventListener("mouseenter", onEnter);
        wrapper.removeEventListener("mouseleave", onLeave);
      }
    };
  }, [type]);

  const darkBgColors = [
    "bg-[#3b0a0a]",
    "bg-[#1e1b4b]",
    "bg-[#4a044e]",
    "bg-[#1e3a8a]",
    "bg-[#7f1d1d]",
    "bg-[#3b0764]",
    "bg-[#0f172a]",
  ];

  const randomBgClass = useMemo(() => {
    const index = Math.floor(Math.random() * darkBgColors.length);
    return darkBgColors[index];
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden p-1 w-[32%] aspect-square group">
      {(type === "image" || type === "video") && (
        <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
      )}

      {type === "image" && (
        <>
          <img
            ref={mediaRef}
            src={src}
            alt="post"
            className="w-full h-full object-cover rounded-md transition-transform duration-300 ease-out"
          />
          {caption && (
            <div className="absolute bottom-10 w-full text-center text-white text-sm font-semibold z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {caption}
            </div>
          )}
          {hasMultipleImages && (
            <div className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center z-20 ">
              <FaClone className="text-white text-2xl" />
            </div>
          )}
        </>
      )}

      {type === "video" && (
        <div className="relative w-full h-full">
          <video
            ref={(el) => {
              videoRef.current = el;
              mediaRef.current = el;
            }}
            src={src}
            muted
            loop
            playsInline
            className="w-full h-full object-cover rounded-md transition-transform duration-300 ease-out"
          />
          <div className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center z-20 shadow-md">
            <BiSolidMoviePlay className="text-white text-2xl" />
          </div>
        </div>
      )}

      {type === "text" && (
        <div
          className={`relative w-full h-full ${randomBgClass} rounded-md p-4 z-10 flex flex-col justify-between`}
        >
          {/* User Info */}
          <div className="flex items-center gap-3 z-20">
            <img
              src={user.profileImage || "https://i.pravatar.cc/30"}
              alt="profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="text-left text-sm leading-tight">
              <div className="font-semibold text-white text-[15px]">
                {user.name || "User"}
              </div>
              <div className="text-gray-300 text-[13px]">
                @{user.username || "username"}
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 mt-3">
            <p className="text-white text-[18px] font-medium leading-snug text-left line-clamp-[6] break-words overflow-hidden">
              {text}
            </p>
          </div>

          {/* Like/Comment Counts */}
          <div className="flex items-center gap-4 mt-3 text-base text-gray-200 z-20">
            <div className="flex items-center gap-1">
              <FaHeart /> {likes}
            </div>
            <div className="flex items-center gap-1">
              <FaRegComment /> {comments}
            </div>
          </div>
        </div>
      )}

      {(type === "image" || type === "video") && (
        <div className="absolute bottom-2 left-2 flex items-center gap-4 text-base text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-1">
            <FaHeart /> {likes}
          </div>
          <div className="flex items-center gap-1">
            <FaRegComment /> {comments}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostThumbnail;
