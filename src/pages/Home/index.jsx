import React, { useEffect, useState } from "react";
import PostCreationLabel from "../../components/home/PostCreationLabel";
import PostCard from "../../components/home/PostCard";
import { onValue, ref } from "firebase/database";
import { db } from "../../../Database/Firebase.config";
import PeopleSuggestion from "../../components/home/PeopleSuggestion";

const Index = () => {
  const [feedPostData, setFeedPostData] = useState([]);

  useEffect(() => {
    const postsRef = ref(db, `posts/`);
    const unsub = onValue(postsRef, (snapshot) => {
      if (snapshot.exists()) {
        const postArr = [];
        snapshot.forEach((postSnapshot) => {
          postArr.push(postSnapshot.val());
        });
        setFeedPostData(postArr.sort((a, b) => b.timeStamp - a.timeStamp));
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="w-full h-full overflow-y-scroll ">
      <div className='flex justify-around w-9/10 h-full  mx-auto'>
        <div className="feed pe-10 w-2/3 max-w-180 ms-1/10 mt-5">
          <PostCreationLabel />
          <div className="feed my-3">
            {feedPostData && feedPostData.length > 0 ? (
              <div className="flex flex-col gap-y-3">
                {feedPostData.map((postData) => (
                  <PostCard key={postData.id} postData={postData} />
                ))}
              </div>
            ) : (
              <div>
                <p>No posts found</p>
              </div>
            )}
          </div>
        </div>
        <div className="min-w-[22%] h-20">
          
        </div>
        <div className="people min-w-[22%] fixed top-4 right-10 max-h-[90dvh]">
          <PeopleSuggestion />
        </div>
      </div>
    </div>
  );
};

export default Index;
