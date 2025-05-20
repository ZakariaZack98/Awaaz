import React, { useEffect, useState } from "react";
import NotificationsList from "../../components/notifications/NotificationsList";
import { onValue, ref } from "firebase/database";
import { db, auth } from "../../../Database/Firebase.config";

const Notifications = () => {
  const [notificationData, setNotificationData] = useState([]);

  // Fetch all notificationData from DB
  useEffect(() => {
    const notificationRef = ref(db, `notifications/${auth.currentUser.uid}`);
    onValue(notificationRef, (snapshot) => {
      const notificationArr = [];
      snapshot.forEach((notificationSnapshot) => {
        notificationArr.push({
          ...notificationSnapshot.val(),
          Key: notificationSnapshot.key,
        });
      });
      setNotificationData(notificationArr);
    });
  }, []);

  return (
    <div className="py-10 px-20">
      <h1 className="text-4xl font-bold mb-5">Notifications</h1>
      <NotificationsList NotificationDataArr={notificationData} />
    </div>
  );
};

export default Notifications;
