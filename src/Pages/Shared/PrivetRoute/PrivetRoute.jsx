// Pages/Protected/PrivateRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "../../Hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // ✅ লগইন না থাকলে লগইন পেজে পাঠাবে
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ SUPERadmin হলে Admin Dashboard এ পাঠাবে
  if (user?.newpartroles === "SUPERadmin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
