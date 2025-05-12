import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC9Ofji3LxIDC0-NX9sj1JIwEOdLIDTo-M",
  authDomain: "awaaz-f1714.firebaseapp.com",
  projectId: "awaaz-f1714",
  storageBucket: "awaaz-f1714.firebasestorage.app",
  messagingSenderId: "773376676721",
  appId: "1:773376676721:web:27159f1ada52b4d1aa9cd0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };