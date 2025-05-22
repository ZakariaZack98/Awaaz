import React from 'react';

const PostCardSkeleton = () => {
  return (
    <div className="py-3 px-4 bg-white rounded-md shadow-md animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="w-24 h-3 bg-gray-200 rounded"></div>
            <div className="w-16 h-2 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      </div>

      {/* Image placeholder */}
      <div className="w-full h-96 bg-gray-200 rounded-md mb-3"></div>

      {/* Action icons */}
      <div className="flex gap-4 mb-3">
        <div className="w-6 h-6 bg-gray-200 rounded"></div>
        <div className="w-6 h-6 bg-gray-200 rounded"></div>
        <div className="w-6 h-6 bg-gray-200 rounded"></div>
      </div>

      {/* Like count and caption */}
      <div className="space-y-2">
        <div className="w-20 h-3 bg-gray-200 rounded"></div>
        <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
      </div>

      {/* Comments section */}
      <div className="mt-3 space-y-2">
        <div className="w-32 h-3 bg-gray-200 rounded"></div>
        <div className="w-full h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default PostCardSkeleton;