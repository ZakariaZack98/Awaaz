import React from "react";
import NotificationsCard from "./NotificationsCard";

const NotificationsList = ({ NotificationDataArr }) => {
  // console.log(NotificationDataArr);

  return (
    <div className="flex flex-col items-center  h-[85vh]">
      {NotificationDataArr?.map((item) => (
        <NotificationsCard SingleNotificationData={item} />
      ))}
    </div>
  );
};

export default NotificationsList;
