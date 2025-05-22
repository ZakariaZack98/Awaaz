import React from 'react';
import PostCardSkeleton from './PostCardSkeleton';

const HomeSkeleton = () => {
  return (
    <div className="w-full h-full overflow-y-scroll">
      <div className='flex justify-around w-9/10 h-full mx-auto'>
        <div className="feed pe-10 w-2/3 max-w-180 ms-1/10 mt-5">
          {/* Post Creation Label Skeleton */}
          <div className="bg-white rounded-md p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div className="flex-1 h-10 bg-gray-200 rounded-full"></div>
            </div>
          </div>
          
          {/* Feed Posts Skeleton */}
          <div className="feed my-3 flex flex-col gap-y-3">
            {[1, 2, 3].map((item) => (
              <PostCardSkeleton key={item} />
            ))}
          </div>
        </div>

        {/* People Suggestion Skeleton */}
        <div className="people min-w-[22%] max-h-[90dvh]">
          <div className="bg-white rounded-md p-4 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="flex-1">
                  <div className="w-24 h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="w-16 h-2 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSkeleton;