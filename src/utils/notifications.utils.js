import { ref, update } from "firebase/database";
import { db } from "../../Database/Firebase.config";

export const handleRead = (navigate, navigateTo) => {
  navigate(navigateTo);
};

export const readNotificationUpdateDb = (receiverId, Key) => {
  const notificationRef = ref(db, `notifications/${receiverId}/${Key}`);
  update(notificationRef, { read: true })
    .catch((error) => {
      console.error("Error notification:", error);
    });
};
