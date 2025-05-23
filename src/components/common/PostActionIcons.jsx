import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { IoChatbubbleOutline } from "react-icons/io5";
import { PiPaperPlaneTilt } from "react-icons/pi";

const PostActionIcons = ({ liked, saved, handleLike, handleSave, activeCommentField, setActiveCommentField }) => {
  return (
    <div className="icons flex justify-between text-2xl">
      <div className="flex items-center gap-x-4">
        <span onClick={() => handleLike()}>
          {liked ? (
            <FaHeart className="text-red-600 cursor-pointer"/>
          ) : (
            <FaRegHeart className="cursor-pointer"  />
          )}
        </span>
        <span>
          <IoChatbubbleOutline className={`cursor-pointer ${activeCommentField ? 'text-blue-500' : ''}`} onClick={() => setActiveCommentField(!activeCommentField)}/>
        </span>
        <span>
          <PiPaperPlaneTilt className=" cursor-pointer" />
        </span>
      </div>
      <span onClick={() => setSaved(!saved)}>
        {saved ? (
          <FaBookmark className="text-red-600 cursor-pointer" onClick={() => handleSave()} />
        ) : (
          <FaRegBookmark className="cursor-pointer" onClick={() => handleSave()} />
        )}
      </span>
    </div>
  );
};

export default PostActionIcons;
