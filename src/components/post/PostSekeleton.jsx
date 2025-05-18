import { MdClose } from "react-icons/md";

const PostSkeleton = ({ onlyText }) => {
  return (
    <div className="w-screen h-screen absolute top-0 left-0 flex justify-center items-center bg-[rgba(0,0,0,0.7)]" style={{ zIndex: 500 }}>
      <div className="absolute top-5 right-5 cursor-pointer text-white">
        <span className="text-3xl">
          <MdClose />
        </span>
      </div>
      <div className={`postBox h-[92dvh] flex overflow-hidden ${onlyText ? 'w-[40dvw]' : 'w-[70dvw]'}`} style={{ boxShadow: "0px 0px 10px 10px rgba(0,0,0,0.1)" }}>
        {!onlyText && (
          <div className="h-full w-1/2 bg-gray-200 animate-pulse"></div>
        )}
        <div className={`rightSection h-full ${onlyText ? 'w-full' : 'w-1/2'} flex flex-col justify-between border-b border-t border-e bg-white`}>
          <div className="header h-15 border-b border-[rgba(0,0,0,0.26)] p-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="w-32 h-4 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
          <div className="caption&comments h-[68%] overflow-y-scroll p-3" style={{scrollbarWidth: 'none'}}>
            <div className="captionSec flex gap-x-3 mb-6">
              <div className="min-w-10 w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="w-full">
                <div className="w-24 h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="w-full h-3 bg-gray-200 animate-pulse rounded mb-1"></div>
                <div className="w-4/5 h-3 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
            <div className="commentSec my-4 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-x-3">
                  <div className="min-w-10 w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="w-full">
                    <div className="w-24 h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                    <div className="w-full h-3 bg-gray-200 animate-pulse rounded mb-1"></div>
                    <div className="w-3/4 h-3 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="likes&others h-17 border-t border-[rgba(0,0,0,0.26)] p-3">
            <div className="flex flex-col justify-center gap-y-1">
              <div className="flex gap-4">
                <div className="w-6 h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="w-6 h-6 bg-gray-200 animate-pulse rounded"></div>
                <div className="w-6 h-6 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="w-32 h-4 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
          <div className="commentField h-13 border-t border-[rgba(0,0,0,0.26)] px-3 py-2">
            <div className="w-full h-10 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;