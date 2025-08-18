// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbJ-TA0ErywLN8Nc7C9iK1f3_QI35h6YU",
  // The authDomain will be set dynamically on the client side
  authDomain: "map-api-427111.firebaseapp.com",
  projectId: "map-api-427111",
  storageBucket: "map-api-427111.appspot.com",
  messagingSenderId: "344837483986",
  appId: "1:344837483986:web:87d80ba6ca000a16f8ec0b",
  measurementId: "G-9W8TPF1Q3D"
};

// Dynamically set authDomain on the client side
if (typeof window !== 'undefined') {
  firebaseConfig.authDomain = window.location.hostname;
}

// Initialize Firebase
let app;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
