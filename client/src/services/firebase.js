import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// 🚨 REPLACE THIS WHOLE OBJECT WITH YOUR KEYS FROM NOTEPAD 🚨
const firebaseConfig = {
    apiKey: "AIzaSyDLXxpCjFBE2vG3Bgqb0igbi68LevIzNnk",
    authDomain: "mini-drive-app-b3b43.firebaseapp.com",
    projectId: "mini-drive-app-b3b43",
    storageBucket: "mini-drive-app-b3b43.firebasestorage.app",
    messagingSenderId: "340822963280",
    appId: "1:340822963280:web:e5d608490861bd63918d55"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);