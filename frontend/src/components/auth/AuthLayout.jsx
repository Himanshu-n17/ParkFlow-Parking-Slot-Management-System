import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo">
          <h2>ParkIQ</h2>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
