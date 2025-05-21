import { get, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { db } from "../../../Database/Firebase.config";
import { FetchUserData } from "../../utils/fetchData.utils";
import { MdClose } from "react-icons/md";
import UserList from "../../components/common/UserList";
import UserListSkeleton from "../Skeleton/UserListSkeleton";

const FSUserList = ({ postId, commentId, replyId, userId, setShowUserList, initialHeading = "Likes" }) => {
  const [heading, setHeading] = useState(initialHeading);
  const [usersData, setUsersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: GET THE REF PATH OF DB WITH TYPE & ID
  const getRefPath = (type, id) => {
    const paths = {
      post: `/postsMetaData/${id}/likes`,
      comment: `/commentsMetaData/${id}/likes`,
      reply: `/repliesMetaData/${id}/likes`,
      followers: `/followers/${id}`,
      followings: `/followings/${id}`
    };
    return paths[type];
  };

  // TODO: FETCH USERS DATA WITH TYPE AND ID
  const fetchUsersList = async (type, id) => {
    const targetIdRef = ref(db, getRefPath(type, id));
    const snapshot = await get(targetIdRef);
    if (!snapshot.exists()) {
      return [];
    }
    const targetIds = Object.keys(snapshot.val());
    const userDataPromises = targetIds.map(id => FetchUserData(id));
    const userData = await Promise.all(userDataPromises);
    return userData.filter(user => user !== null);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let users = [];
        if (postId) {
          users = await fetchUsersList('post', postId);
        } else if (commentId) {
          users = await fetchUsersList('comment', commentId);
        } else if (replyId) {
          users = await fetchUsersList('reply', replyId);
        } else if (userId && initialHeading === 'followers') {
          users = await fetchUsersList('followers', userId);
        } else if (userId && initialHeading === 'followings') {
          users = await fetchUsersList('followings', userId);
        }
        setUsersData(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsersData([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (postId || commentId || replyId) {
      setHeading("Likes");
    } else if (userId && initialHeading === 'followers') {
      setHeading("Followers");
    } else if (userId && initialHeading === 'followings') {
      setHeading("Followings");
    }

    fetchUsers();
  }, [postId, commentId, replyId, userId, initialHeading]);

  return (
    <div className="w-screen h-screen absolute top-0 left-0 flex justify-center items-center bg-[rgba(0,0,0,0.7)]" style={{ zIndex: 500 }}>
      <div className="w-3/10 max-w-120 h-7/10 max-h-150 bg-white rounded-xl overflow-hidden">
        <div className="py-2 font-semibold border-b border-[rgba(0,0,0,0.24)] relative">
          <h3 className="text-center">{heading}</h3>
          <span 
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setShowUserList(false)}
          >
            <MdClose />
          </span>
        </div>
        <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(70vh - 40px)" }} onClick={() => setShowUserList(false)}>
          {isLoading ? (
            <UserListSkeleton count={6} />
          ) : usersData.length > 0 ? (
            <UserList userListData={usersData} maxUser={usersData.length} />
          ) : (
            <p className="text-center text-gray-500">No users found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FSUserList;
