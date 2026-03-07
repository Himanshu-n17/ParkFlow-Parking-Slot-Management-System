import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/userContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(UserContext);

  // While checking auth
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role not allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // If everything ok → render routes
  return <Outlet />;
};

export default PrivateRoute;
