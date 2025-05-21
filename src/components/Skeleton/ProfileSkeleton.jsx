import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 animate-pulse">
      <div className="flex items-start space-x-10">
        <div className="w-32 h-32 rounded-full bg-gray-300"></div>

        <div className="flex flex-col space-y-2 flex-1">
          <div className="w-40 h-6 bg-gray-300 rounded"></div>
          <div className="w-24 h-4 bg-gray-300 rounded"></div>
          <div className="flex gap-6">
            <div className="w-16 h-4 bg-gray-300 rounded"></div>
            <div className="w-20 h-4 bg-gray-300 rounded"></div>
            <div className="w-20 h-4 bg-gray-300 rounded"></div>
          </div>
          <div className="flex gap-4 mt-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Skeleton Tabs and Posts */}
      <div className="flex justify-center border-t pt-4 mt-6 space-x-4">
        <div className="w-20 h-6 bg-gray-300 rounded"></div>
        <div className="w-20 h-6 bg-gray-300 rounded"></div>
      </div>

      <div className="flex flex-wrap -m-1 mt-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-1/3 p-1">
            <div className="w-full aspect-[4/4] bg-gray-300 rounded-md"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSkeleton;
