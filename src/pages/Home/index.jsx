import React, { useContext } from "react";
import PostCreationLabel from "../../components/home/PostCreationLabel";
import PostCard from "../../components/home/PostCard";
import PeopleSuggestion from "../../components/home/PeopleSuggestion";
import HomeSkeleton from "../../components/Skeleton/HomeSkeleton";
import { DataContext } from "../../contexts/DataContexts";

const Index = () => {
  const { feedData } = useContext(DataContext);
  if (!feedData) {
    return <HomeSkeleton />;
  }
  return (
    <div className="w-full h-full overflow-y-scroll ">
      <div className='flex justify-around w-9/10 h-full  mx-auto'>
        <div className="feed pe-10 w-2/3 max-w-180 ms-1/10 mt-5">
          <PostCreationLabel />
          <div className="feed my-3">
            {feedData && feedData.length > 0 ? (
              <div className="flex flex-col gap-y-3">
                {feedData.map((postData) => (
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
