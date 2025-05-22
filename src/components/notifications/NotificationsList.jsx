import React from "react";
import NotificationsCard from "./NotificationsCard";

const NotificationsList = ({ NotificationDataArr }) => {
  return (
    <div className="flex flex-col ">
      {NotificationDataArr?.reverse().map((item, index, arr) => (
        <div className={index < arr.length - 1 ? "border-b border-gray-300" : ""}>
          <NotificationsCard key={item.id} SingleNotificationData={item} />
        </div>
      ))}
    </div>
  );
};

export default NotificationsList;
