import React, { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { db } from "../../../Database/Firebase.config";
import PostThumbnail from "../../components/common/PostThumbnail";
import { FetchLikesCommentsCount } from "../../utils/fetchData.utils";
import Spinners from "../../components/common/Spinners";
import Post from "../../pages/Post/Post";

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isPostOpen, setIsPostOpen] = useState(false);

  useEffect(() => {
    const fetchExplorePosts = async () => {
      try {
        const postsSnap = await get(ref(db, "posts"));

        if (!postsSnap.exists()) {
          setPosts([]);
          setLoading(false);
          return;
        }

        const postsData = postsSnap.val();

        const postsArray = await Promise.all(
          Object.entries(postsData).map(async ([id, post]) => {
            const [likeCount, commentCount] = await FetchLikesCommentsCount(id);

            return {
              id,
              ...post,
              likeCounts: likeCount || 0,
              commentCount: commentCount || 0,
            };
          })
        );

        const sortedPosts = postsArray.sort(
          (a, b) => b.likeCounts - a.likeCounts
        );

        setPosts(sortedPosts.filter(post => post.visibility !== 'private'));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching explore posts:", error);
        setLoading(false);
      }
    };

    fetchExplorePosts();
  }, []);

  // todo: handlePostClick for post page open
  const handlePostClick = (postId) => {
    setSelectedPostId(postId);
    setIsPostOpen(true);
  };
  return (
    <div className="relative h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto max-w-5xl mx-auto mt-5 flex flex-wrap gap-2 justify-center p-2">
        {loading ? (
          <Spinners />
        ) : (
          posts.map((post) => {
            const user = {
              name: post.posterName || "User",
              username: post.posterUsername || "username",
              profileImage: post.posterImgUrl || "https://i.pravatar.cc/30",
            };

            const commonProps = {
              key: post.id,
              likes: post.likeCounts || 0,
              comments: post.commentCount || 0,
              user,
            };

            if (post.imgUrls && post.imgUrls.length > 0) {
              return (
                <PostThumbnail
                  {...commonProps}
                  type="image"
                  src={post.imgUrls[0]}
                  onClick={() => handlePostClick(post.id)}
                  caption={post.text}
                  hasMultipleImages={post.imgUrls.length > 1}
                />
              );
            } else if (post.videoUrl) {
              return (
                <PostThumbnail
                  {...commonProps}
                  type="video"
                  onClick={() => handlePostClick(post.id)}
                  src={post.videoUrl}
                  caption={post.text}
                />
              );
            } else if (post.text) {
              return (
                <PostThumbnail
                  {...commonProps}
                  onClick={() => handlePostClick(post.id)}
                  type="text"
                  text={post.text}
                />
              );
            }

            return null;
          })
        )}
      </div>
      {isPostOpen && (
        <div className="fixed inset-0 bg-black/60 z-1000 flex items-center justify-center">
          <Post postId={selectedPostId} setOpenPost={setIsPostOpen} />
        </div>
      )}
    </div>
  );
};

export default Explore;
