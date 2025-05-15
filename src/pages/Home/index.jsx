import React, { useEffect, useState } from 'react'
import PostCreationLabel from '../../components/home/PostCreationLabel'
import PostCard from '../../components/home/PostCard'
import { get, ref } from 'firebase/database';
import { db } from '../../../Database/Firebase.config';

const Index = () => {
  const [feedPostData, setFeedPostData] = useState([]);

  useEffect(() => {
    const postsRef = ref(db, `posts/`);
    get(postsRef)
    .then(snapshot => {
      if(snapshot.exists()) {
        const postArr = [];
        snapshot.forEach(postSnapshot => {
          postArr.push(postSnapshot.val());
        })
        setFeedPostData(postArr);
      }
    })
  }, [])

  return (
    <div className='flex w-9/10 h-full overflow-y-scroll mx-auto ' style={{scrollbarWidth: 'none'}}>
      <div className="feed w-2/3 px-10 ">
        <PostCreationLabel/>
        <div className="feed my-3">
          {
            feedPostData && feedPostData.length > 0 ? (
              <div className='flex flex-col gap-y-3'>
                {
                  feedPostData.map(postData => <PostCard key={postData.id} postData={postData}/>)
                }
              </div>
            ) : (
              <div>
                <p>No posts found</p>
              </div>
            )
          }
        </div>
      </div>
      <div className="people w-1/3">
        <p>This is suggestion part</p>
      </div>
    </div>
  )
}

export default Index
