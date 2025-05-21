import React from 'react';

const UserListSkeleton = ({ count = 5 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="flex items-center gap-x-3 p-2 animate-pulse">
          {/* Avatar skeleton */}
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          
          {/* Name and username skeleton */}
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
          
          {/* Follow button skeleton */}
          <div className="w-20 h-8 bg-gray-200 rounded"></div>
        </div>
      ))}
    </>
  );
};

export default UserListSkeleton;