import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmCk1CfHn0um_8ghHKF5Lek3trPMn94Ac",
  authDomain: "split-la.firebaseapp.com",
  projectId: "split-la",
  storageBucket: "split-la.firebasestorage.app",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
