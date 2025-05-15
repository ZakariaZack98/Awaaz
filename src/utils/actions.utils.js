import { ref, remove } from "firebase/database"
import { auth, db } from "../../Database/Firebase.config"
import { toast } from "react-toastify"

// TODO: UNFOLLOW A USER ==================================
export const Unfollow = async userId => {
  const followingRef = ref(db, `followings/${auth.currentUser.uid}/${userId}`)
  const followerRef = ref(db, `followers/${userId}/${auth.currentUser.uid}`)
  try {
    await Promise.all([remove(followingRef), remove(followerRef)]);
    toast.info('Unfollow successfull')
  } catch (error) {
    toast.error('Unfollow failed')
    console.log(error)
  }
}

// TODO: SAVE A POST ========================================