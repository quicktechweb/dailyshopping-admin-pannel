import { createContext, useState, useEffect } from "react";
import useFirebase from "../../Hooks/useFirebase";
import PropTypes from "prop-types";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const AllContext = useFirebase();

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  // Central function to update context + localStorage
  const updateUser = (newData) => {
    setUser((prev) => {
      const updated = { ...prev, ...newData };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  // Fetch latest user from backend (e.g., on page load)
  const fetchLatestUser = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`https://dailyshopping-backend.onrender.com/api/auth/get-user/${user._id}`);
      if (res.data.success) {
        updateUser(res.data.user); // update context + localStorage
      }
    } catch (err) {
      console.error("Error fetching latest user", err);
    }
  };

  useEffect(() => {
    fetchLatestUser();
  }, []); // runs on page load

  useEffect(() => {
    if (AllContext?.user) {
      updateUser(AllContext.user);
    }
  }, [AllContext?.user]);

  return (
    <AuthContext.Provider value={{ ...AllContext, user, setUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
