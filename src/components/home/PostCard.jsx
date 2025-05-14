import React from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { GoDotFill } from 'react-icons/go';
import ImageSlider from '../common/ImageSlider';

const PostCard = () => {
  // const {id, text, poseterId, posterName, posterImgUrl, createdAt, imgUrls, videoUrl, likeCounts} = postData;
  return (
    <div className='p-3 bg-white rounded-md shadow-md'>
      <div className="header flex justify-between items-center pb-2">
        <div className="flex items-center gap-x-2 cursor-pointer">
          <img src={'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png'} alt={ ''} className='rounded-full w-10 h-10'/>
          <div className="flex items-start gap-x-2">
            <div className="flex flex-col">
              <p className="text-sm font-semibold">{'Sadee Muhammad Zakaria'}</p>
              <p className="opacity-70 text-[13px]">{'@username'}</p>
            </div>
            <span><GoDotFill /></span>
            <p className="opacity-70 text-[13px]">{'2 hours ago'}</p>
          </div>
        </div>
        <span>
          <BsThreeDotsVertical/>
        </span>
      </div>
      <div className="media">
        <ImageSlider/>
      </div>
    </div>
  )
}

export default PostCard
