// Pages/Protected/AdminProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    // Not logged in
    return <Navigate to="/dashbaord-admin-luckyshop/login" replace />;
  }

  // Allow SUPERadmin, Moderator, or Support
  const allowedRoles = ["SUPERadmin", "Moderator", "Support"];
  if (!allowedRoles.includes(user?.newpartroles)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
