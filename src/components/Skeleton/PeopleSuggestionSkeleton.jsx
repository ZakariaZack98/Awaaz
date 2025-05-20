import React from 'react'

const PeopleSuggestionSkeleton = () => {
  return (
    <>
    <div className="w-[70%] p-4 h-screen bg-white shadow rounded-xl space-y-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <div className="w-24 h-4 bg-gray-200 rounded mb-1"></div>
            <div className="w-20 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="w-12 h-4 bg-gray-200 rounded"></div>
      </div>

      {/* Suggested Section Skeleton */}
      <div className="flex justify-between items-center">
        <div className="w-24 h-3 bg-gray-200 rounded"></div>
        <div className="w-12 h-3 bg-gray-200 rounded"></div>
      </div>

      {/* User List Skeleton */}
      <div className="h-[75%] rounded-xl overflow-y-scroll space-y-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div>
                <div className="w-24 h-4 bg-gray-200 rounded mb-1"></div>
                <div className="w-20 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-[10px] text-gray-400 pt-2">
        <div className="w-16 h-3 bg-gray-200 rounded"></div>
      </footer>
      </div>
    </>
  );
}

export default PeopleSuggestionSkeleton
