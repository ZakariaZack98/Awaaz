import React, { useEffect, useRef, useState } from 'react'
import { LiaPhotoVideoSolid } from 'react-icons/lia'
import { auth, db } from '../../../Database/Firebase.config'
import { ref, set } from 'firebase/database'
import { uploadFiles } from '../../utils/fileuploads.utils'
import { GetTimeNow } from '../../utils/date.utils'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const AddStory = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [caption, setCaption] = useState('');

  const handleUploaderClick = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      const fileUrl = URL.createObjectURL(file);
      setPreview(fileUrl);
      setFileType(file.type.startsWith('video/') ? 'video' : 'image');
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleAddStory = async () => {
    if (!preview) {
      toast.error('Please select a file to upload')
      return
    }
    try {
      navigate('/');
      toast.info('Your story is uploading...')
      const uploadedUrls = await uploadFiles([fileInputRef.current.files[0]])
      const fileUrl = uploadedUrls[0]
      if (!fileUrl) {
        toast.error('File upload failed')
        return
      }
      const postId = auth.currentUser.uid + Date.now()
      const storyRef = ref(db, `stories/${postId}`)
      const storyData = {
        id: postId,
        timeStamp: Date.now(),
        posterId: auth.currentUser.uid,
        posterName: auth.currentUser.displayName,
        posterImgUrl: auth.currentUser.photoURL,
        createdAt: GetTimeNow(),
        visibility: "public",
        text: caption,
        imgUrl: fileType === 'image' ? fileUrl : null,
        videoUrl: fileType === 'video' ? fileUrl : null,
        likeCounts: 0
      }
      await set(storyRef, storyData)
      toast.success('Story added successfully!')
      setPreview(null)
      setCaption('')
      fileInputRef.current = null;
    } catch (error) {
      console.error('Error adding story:', error)
      toast.error('Failed to add story: ' + error.message)
    }
  }

  return (
    <div className='h-full w-8/10 mx-auto p-3'>
      <h1 className='text-3xl font-light mb-5 text-blue-500'>Create a story</h1>
      <div className="flex h-[85dvh] gap-x-8">
        <div className="preview relative full aspect-[9/16] overflow-hidden rounded-2xl border-2 flex justify-center items-center bg-black">
          <div 
            className="uploaderLabel absolute flex flex-col justify-center items-center bg-[rgba(0,0,0,0.43)] rounded-md p-3 cursor-pointer hover:scale-110 duration-200" title='Upload/Change file'
            onClick={handleUploaderClick}
          >
            <span className='text-5xl text-white drop-shadow-2xl'>
              <LiaPhotoVideoSolid />
            </span>
          </div>
          {preview ? (
            fileType === 'video' ? (
              <video 
                src={preview} 
                className='object-contain object-center w-full'
                controls
                autoPlay
                muted
              />
            ) : (
              <img 
                src={preview} 
                className='object-contain object-center w-full'
                alt="Story preview"
              />
            )
          ) : (
            <img 
              src="https://i.redd.it/k1ac1xpb31wy.png" 
              className='object-contain object-center w-full'
              alt="Default preview"
            />
          )}
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*,video/*" 
            className="hidden" 
            onChange={handleFileChange}
          />
        </div>
        <div className="text flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-2">
            <div className="flex">
              <h2 className='text-xl'>Add caption: (optional)</h2>
              <span className='text-sm ms-3 text-blue-500'>*Maximum 160 charecters</span>
            </div>
            <textarea name="caption" id="" maxLength={160} value={caption} className='w-100 border rounded h-30 p-2 focus:outline-0' onChange={(e) => setCaption(e.target.value)}></textarea>
          </div>
          <button 
            onClick={handleAddStory}
            className='bg-blue-500 text-white px-5 py-1 rounded hover:bg-blue-700 duration-200 cursor-pointer'
          >
            Add to Story
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddStory
