import React, { useContext } from "react";
import NotificationsList from "../../components/notifications/NotificationsList";

import { DataContext } from "../../contexts/DataContexts";

const Notifications = () => {
  const { notificationsData } = useContext(DataContext);

  return (
    <div className="py-10 px-20 h-[90dvh] ">
      <h1 className="text-4xl font-bold mb-5">Notifications</h1>
      <div className="h-[80dvh] overflow-y-scroll">
        <NotificationsList NotificationDataArr={notificationsData} />
      </div>
    </div>
  );
};

export default Notifications;
