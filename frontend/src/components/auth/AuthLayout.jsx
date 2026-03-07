import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo">
          <div className="logo-icon">P</div>
          <h2>PARKFLOW</h2>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
