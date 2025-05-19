import React, { useState, useRef, useEffect } from 'react';
import { FaRegSmile } from 'react-icons/fa';
import { FaPaperPlane } from 'react-icons/fa6';
import EmojiPicker from 'emoji-picker-react';
import { AddReply } from '../../utils/actions.utils';
import { toast } from 'react-toastify';

const ReplyPrompt = ({ commentData, replierName, replierId, setOpenReplyPrompt, repliesCount, setRepliesCount }) => {
  const {id, commenterName, commenterId, postId } = commentData;
  const [reply, setReply] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEmojiClick = (emojiData) => {
    setReply(prev => prev + emojiData.emoji);
  };

  const handleAddReply = async () => {
    if(reply.length === 0) {
      toast.error(`Can't post empty reply.`);
      return;
    }
    try {
      await AddReply(id, replierId ? replierId : commenterId, replierName ? replierName : commenterName, postId, reply);
      setRepliesCount(repliesCount + 1);
    } catch (error) {
      console.error('Error posting reply-', error.message)
    } finally {
      setReply('');
      setOpenReplyPrompt(false);
    }
  }

  return (
    <div className='rounded-md p-2 border border-[rgba(0,0,0,0.19)] my-2 text-sm relative'>
      <p className="font-medium text-red-700">@{replierName ? replierName : commenterName}</p>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder='type a reply...'
          className='w-full focus:outline-0 mt-2'
          value={reply}
          onChange={e => setReply(e.target.value)}
          onKeyDown={e => e.key === 'Enter' ? handleAddReply() : null}
        />
        <div className="flex items-center gap-x-2 relative">
          <FaRegSmile
            className='text-lg me-1 cursor-pointer opacity-70 mt-1'
            onClick={() => setShowEmojiPicker(prev => !prev)}
          />
          <FaPaperPlane className='text-lg text-red-700 me-1 cursor-pointer' onClick={() => handleAddReply()}/>
        </div>
      </div>
      {showEmojiPicker && (
        <div className="absolute z-50 mt-2" ref={emojiRef}>
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default ReplyPrompt;
