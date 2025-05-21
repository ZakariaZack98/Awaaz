const UserCardSkeleton = () => {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-3 w-full">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="flex-1">
          <div className="w-24 h-4 bg-gray-200 animate-pulse rounded mb-1"></div>
          <div className="w-16 h-3 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="w-16 h-6 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </div>
  );
};
export default UserCardSkeleton;