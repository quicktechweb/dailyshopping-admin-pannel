// NotificationContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../Hooks/useAuth";
import PropTypes from "prop-types";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // Fetch user-specific notifications
  useEffect(() => {
    if (!user?._id) return;

    axios.get(`http://localhost:5000/api/notification/${user._id}`)
      .then(res => {
        if (res.data.success) setNotifications(res.data.notifications);
      })
      .catch(console.error);
  }, [user]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export const useNotifications = () => useContext(NotificationContext);
