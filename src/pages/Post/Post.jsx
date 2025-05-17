import React, { useState } from 'react'
import ImageSlider from '../../components/common/ImageSlider'
import PostHeader from '../../components/common/PostHeader'
import { mockData } from '../../lib/mockData'
import { MdClose } from 'react-icons/md'

const Post = ({postData = mockData.postData, setOpenPost, followed, setFollowed, saved, setSaved}) => {
  const [openPostActions, setOpenPostActions] = useState(false);
  return (
    <div className='w-screen h-screen absolute top-0 left-0 flex justify-center items-center bg-[rgba(0,0,0,0.48)]' style={{zIndex: 500}}>
      <div className="absolute top-5 right-5 cursor-pointer text-white">
        <span className='text-3xl'>
          <MdClose onClick={() => setOpenPost(false)}/>
        </span>
      </div>
      <div className="postBox w-[70dvw] h-[92dvh] flex bg-white" style={{boxShadow: '0px 0px 10px 10px rgba(0,0,0,0.1)'}}>
        <div className="media h-full w-1/2 bg-black">
          <ImageSlider inPost={true} imgUrlArray={postData.imgUrls}/>
        </div>
        <div className="rightSection h-full w-1/2 flex flex-col border-b border-t border-e">
          <div className="header h-1/10 border-b border-[rgba(0,0,0,0.26)] p-2">
            <PostHeader postData={postData} openPostActions={openPostActions} setOpenPostActions={setOpenPostActions} followed={followed} setFollowed={setFollowed} saved={saved} setSaved={setSaved}/>
          </div>
          <div className="comments h-8/10"></div>
          <div className="footer h-1/10 border-t border-[rgba(0,0,0,0.26)]"></div>
        </div>
      </div>
    </div>
  )
}

export default Post
