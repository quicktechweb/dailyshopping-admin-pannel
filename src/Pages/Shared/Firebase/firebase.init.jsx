// // src/Pages/Shared/Firebase/firebase.init.js
// import { initializeApp } from "firebase/app";
// import { getMessaging } from "firebase/messaging";
// import firebaseConfig from "./firebase.config";

// let app; // singleton app instance

// // function to initialize Firebase
// const initializeFirebase = () => {
//   if (!app) {
//     app = initializeApp(firebaseConfig);
//   }
//   return app;
// };

// // function to get messaging instance
// export const messaging = () => getMessaging(app);

// export default initializeFirebase;


// src/Pages/Shared/Firebase/firebase.init.js
import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";
import firebaseConfig from "./firebase.config";

let app; // singleton app instance

// ✅ Initialize Firebase only once
const initializeFirebase = () => {
  if (!app) {
    app = initializeApp(firebaseConfig);
    console.log("✅ Firebase initialized");
  }
  return app;
};

// ✅ Safe messaging getter (won't break on unsupported browsers)
export const messaging = async () => {
  if (!app) {
    initializeFirebase();
  }

  const supported = await isSupported();
  if (!supported) {
    console.warn("⚠️ This browser doesn't support Firebase Messaging.");
    return null;
  }

  try {
    const messagingInstance = getMessaging(app);
    return messagingInstance;
  } catch (error) {
    console.error("❌ Error initializing messaging:", error);
    return null;
  }
};

export default initializeFirebase;
