import React from "react";
import NotificationsCard from "./NotificationsCard";

const NotificationsList = ({ NotificationDataArr }) => {
  // console.log(NotificationDataArr);

  return (
    <div className="flex flex-col ">
      {NotificationDataArr?.map((item, index, arr) => (
        <div className={index < arr.length - 1 ? "border-b border-gray-300" : ""}>
          <NotificationsCard Key={item.id} SingleNotificationData={item} />
        </div>
      ))}
    </div>
  );
};

export default NotificationsList;
