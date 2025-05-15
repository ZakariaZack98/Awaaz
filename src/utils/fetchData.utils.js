import { get, ref } from "firebase/database"
import { db } from "../../Database/Firebase.config"

export const FetchUserData = async uid => {
  const userRef = ref(db, `users/${uid}`);
  try {
    const userSnapshot = await get(userRef);
    if(userSnapshot.exists()) {
      return userSnapshot.val();
      console.log(userSnapshot.val())
    } else console.log('User data not found')
  } catch (error) {
    console.log('Error fetching user data', error.message)
  }
}