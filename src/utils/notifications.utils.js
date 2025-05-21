import { ref, update } from "firebase/database";
import { db } from "../../Database/Firebase.config";

export const handleRead = (
  receiverId,
  Key,
  setReadDone,
  navigate,
  navigateTo
) => {
  setReadDone(true);

  const notificationRef = ref(db, `notifications/${receiverId}/${Key}`);
  update(notificationRef, { read: true })
    .then(() => {
      navigate(navigateTo);
    })
    .catch((error) => {
      console.error("Error notification:", error);
    });
};
