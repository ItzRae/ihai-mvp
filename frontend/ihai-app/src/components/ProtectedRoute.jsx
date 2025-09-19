import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom"

const ProtectedRoute = ({ children, roles }) => {
    const isAuthed  = !!window.localStorage.getItem("access_token");
    const role = window.localStorage.getItem("user_role");
    
    if (!isAuthed) {
        <Navigate to="/login" state={{ from: location }} replace/>
    }

      // If role not allowed → send them back

    if (roles && !roles.includes(role)) {
    return <Navigate to={location.state?.from?.pathname || "/"} replace />;
  }

    return children ?? <Outlet/> 

}

export default ProtectedRoute;