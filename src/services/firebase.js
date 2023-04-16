import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBlnIJu2cPV4pVmuOcl9pSFzMgLtq99PnA",
  authDomain: "gorev-15.firebaseapp.com",
  projectId: "gorev-15",
  storageBucket: "gorev-15.appspot.com",
  messagingSenderId: "283165715550",
  appId: "1:283165715550:web:196326cd08e2300ae498cf",
  measurementId: "G-XVDLXST0ZN",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
