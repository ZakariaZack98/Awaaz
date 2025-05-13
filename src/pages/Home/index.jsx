import React from 'react'
import PostCreationLabel from '../../components/home/PostCreationLabel'

const Index = () => {
  return (
    <div className='flex w-9/10 mx-auto '>
      <div className="feed w-2/3 px-10 ">
        <PostCreationLabel/>
      </div>
      <div className="people w-1/3">
        <p>This is suggestion part</p>
      </div>
    </div>
  )
}

export default Index
