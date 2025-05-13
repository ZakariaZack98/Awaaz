import { getAuth, signInWithPopup, FacebookAuthProvider, GoogleAuthProvider, sendEmailVerification } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

const auth = getAuth()
const db = getDatabase();

// Handle google (SignUp with Google)
export const handlegoogle = (navigate) => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
        .then((userinfo) => {
            set(ref(db, `users/${userinfo?.user?.uid}`), {
                userId: userinfo?.user?.uid,
                username: `${userinfo?.user?.displayName.split(' ')[1].toLowerCase()}${Math.round(Math.random() * 1000)}`,
                email: userinfo?.user?.email,
                imgUrl: userinfo?.user?.photoURL,
                fullName: userinfo?.user?.displayName

            }).then(() => {
                if (!auth.currentUser.emailVerified) {
                    sendEmailVerification(auth.currentUser)
                }
                navigate("/")
            }).catch((error) => {
                console.log("Google store data error", error);
            })
        }).catch((error) => {
            console.log("Google loggin error", error);
        })
};
console.log(auth.currentUser);

// Handle Facebook (SignUp with facebook)
export const handlefacebook = (navigate) => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
        .then((userinfo) => {
            set(ref(db, `users/${userinfo?.user?.uid}`), {
                userId: userinfo?.user?.uid,
                username: `${userinfo?.user?.displayName.split(' ')[1].toLowerCase()}${Math.round(Math.random() * 1000)}`,
                email: userinfo?.user?.email,
                imgUrl: userinfo?.user?.photoURL,
                fullName: userinfo?.user?.displayName,
            }).then(() => {
                if (!auth.currentUser.emailVerified) {
                    sendEmailVerification(auth.currentUser)
                }
                navigate("/")
            }).catch((error) => {
                console.log("Facebook store data error", error);
            });
        })
        .catch((error) => {
            console.log("Facebook Login Error", error);
        });
};