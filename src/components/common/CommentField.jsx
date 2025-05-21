import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { CiFaceSmile } from "react-icons/ci";
import { AddComment } from "../../utils/actions.utils";

const CommentField = ({postId, posterId, inPost, setDisplayComment, commentsCount, setCommentsCount }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [comment, setComment] = useState('')
  const emojiPickerRef = useRef(null);

  // TODO: DISPLAY COMMENT ON POSTCARD & POST COMMENT TO POST DB
  const handleComment = async (postId, posterId) => {
    if (comment.length === 0) {
      toast.error(`Can't post empty comment.`);
      return;
    }
    try {
      await AddComment(postId, posterId, comment);
      if(setDisplayComment) {
        setDisplayComment(comment);
      }
      if(commentsCount && setCommentsCount) {
        setCommentsCount(commentsCount + 1);
      }
    } catch (error) {
      console.error('Error posting comment', error.message)
    } finally {
      setComment("");
    }
  };

  // TODO: CLOSE EMOJI PICKER WHEN CLICKED OUTSIDE ==============
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEmojiClick = (emojiObject) => {
    setComment((prevComment) => prevComment + emojiObject.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  return (
    <div className={`comment flex pb-2 pt-4 justify-between ${inPost ? '' : 'border-b border-[rgba(0,0,0,0.18)]'} relative`}>
      <input
        type="text"
        value={comment}
        placeholder="Add a comment"
        onChange={(e) => setComment(e.target.value)}
        className="w-9/10 text-sm focus:outline-0 font-medium"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleComment(postId, posterId, comment);
          }
        }}
      />
      <span className="cursor-pointer" onClick={toggleEmojiPicker}>
        <CiFaceSmile />
      </span>
      {showEmojiPicker && (
        <div className="absolute bottom-10 right-0 z-50" ref={emojiPickerRef}>
          <EmojiPicker onEmojiClick={handleEmojiClick} width={300} height={350} />
        </div>
      )}
    </div>
  );
};

export default CommentField;
