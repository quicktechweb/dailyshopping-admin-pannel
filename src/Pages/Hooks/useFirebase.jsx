import {  useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
// import {  getToken } from "firebase/messaging";
// import initializeFirebase, { messaging } from "../Shared/Firebase/firebase.init";
import initializeFirebase from "../Shared/Firebase/firebase.init";
// import { nanoid } from "nanoid";

initializeFirebase();

const useFirebase = () => {
  // Load user safely
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored || stored === "undefined") return null;
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });

  // const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

   const auth = getAuth();
  //  const messagingInstance = messaging();
   



 // ===== Foreground Notifications =====
  // useEffect(() => {
  //   if (!user) return;

  //   const unsubscribe = onMessage(messagingInstance, (payload) => {
  //     console.log("Foreground notification received:", payload);
  //     const { title, body } = payload.notification || {};
  //     if (title && body) {
  //       const audio = new Audio("/notification-sound.mp3");
  //       audio.play();
  //       setNotifications((prev) => [
  //         { _id: Date.now(), title, message: body, read: false },
  //         ...prev,
  //       ]);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, [user]);

  // ===== Request Notification Permission ON USER CLICK =====
  // const askNotificationPermission = async () => {
  //   if (!user) return;
  //   if (!("Notification" in window)) return;

  //   const permission = await Notification.requestPermission();
  //   if (permission === "granted") {
  //     try {
  //       const currentToken = await getToken(messagingInstance, {
  //         vapidKey:
  //           "BCRv8tHtmuhFJ82yBLmCNMZrcdlT40gZLruJ19yla76C4fUgCHSKjzBQ5EqsfybqUj3H-0Dh7mJEQUUaGM_U-lA",
  //       });

  //       if (currentToken) {
  //         await axios.post(
  //           "https://dailyshopping-backend.onrender.com/api/notification/save-token",
  //           { userId: user._id, fcmToken: currentToken }
  //         );
  //       }
  //     } catch (err) {
  //       console.error("Error getting FCM token:", err);
  //     }
  //   }
  // };

  // Google Sign-In
const googleSignIn = async (navigate) => {
  const provider = new GoogleAuthProvider();
  setIsLoading(true);

  // ⭐ Helper function for toast
  const showToast = (message, icon = "success", timer = 2500) => {
    Swal.fire({
      icon,
      title: message,
      timer,
      showConfirmButton: false,
      position: "top-end",
      toast: true,
    });
  };

  try {
    const result = await signInWithPopup(auth, provider);

    const userData = {
      displayName: result.user.displayName,
      email: result.user.email,
      uid: result.user.uid,
    };

    const { data } = await axios.post(
      "https://dailyshopping-backend.onrender.com/api/auth/google-register",
      userData,
      { headers: { "Content-Type": "application/json" } }
    );

    if (!data.success) {
      showToast(data.message || "Login failed", "error");
      return;
    }

    // -------------------------------
    // ⭐ HANDLE NEW REGISTRATION
    // -------------------------------
    if (data.isNew === true) {
      showToast(
        `Registration successful! Your Referral Code: ${data.user.myrefferalcode}`,
        "success",
        4000
      );
    } else {
      // -------------------------------
      // ⭐ HANDLE LOGIN ONLY
      // -------------------------------
      showToast("Login successful!", "success", 2500);
    }

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    navigate("/");

  } catch (err) {
    console.error(err);
    showToast("Google Sign-In failed", "error");
  } finally {
    setIsLoading(false);
  }
};


 


  // Phone + Password login
 const loginWithPhoneAndPass = async (identifier, password, navigate, location) => {
  setIsLoading(true);
  try {
    const { data } = await axios.post("https://dailyshopping-backend.onrender.com/api/auth/login", {
      identifier,   // ✅ backend will match this
      password,
    });

    if (data.success) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate(location?.state?.from || "/");
    } else {
      Swal.fire({ icon: "error", title: "Login Failed", text: data.message });
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      // title: "Server Error",
      text: err.response?.data?.message || "Something went wrong",
    });
  } finally {
    setIsLoading(false);
  }
};


const loginWithPhoneAndPassadmin = async (phone, password, navigate) => {
  try {
    const { data } = await axios.post(
      "https://dailyshopping-backend.onrender.com/api/auth/admin-login",
      {
        identifier: phone,
        password,
      }
    );

    if (data.success) {
      const user = data.user;

      const updatedUser = {
        ...user,
        newpartroles: user.newpartroles || "SUPERadmin",
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      Swal.fire({
        icon: "success",
        title: "Admin Login Successful!",
        timer: 1500,
        showConfirmButton: false,
      });

      // 🔥 Direct reload with correct route
      setTimeout(() => {
        window.location.href = "/dashboard-admin-dailyshopping/dashboard";
      }, 1500);

    } else {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: data.message || "Invalid credentials",
      });
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Server Error",
      text: err.response?.data?.message || "Something went wrong",
    });
  }
};



  // Logout
  const userLogOut = (navigate) => {
    signOut(auth)
      .then(() => {
        setUser(null);
        localStorage.removeItem("user"); // ✅ remove instead of set undefined
        navigate("/");
      })
      .catch(console.error);
  };

  return { user, isLoading,loginWithPhoneAndPassadmin, googleSignIn, loginWithPhoneAndPass, userLogOut, setUser };
};

export default useFirebase;
