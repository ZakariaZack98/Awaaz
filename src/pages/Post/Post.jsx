import React from 'react'
import ImageSlider from '../../components/common/ImageSlider'

const Post = ({postData}) => {
  return (
    <div className='w-screen h-screen absolute top-0 left-0 flex justify-center items-center bg-[rgba(0,0,0,0.48)]' style={{zIndex: 500}}>
      <div className="postBox w-[70dvw] h-[92dvh] flex bg-white" style={{boxShadow: '0px 0px 10px 10px rgba(0,0,0,0.1)'}}>
        <div className="media h-full w-1/2 bg-black">
          <ImageSlider inPost={true}/>
        </div>
        <div className="comments h-full w-1/2">

        </div>
      </div>
    </div>
  )
}

export default Post
