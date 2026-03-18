import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authService";
import AuthLayout from "../../components/auth/AuthLayout";
import "../../styles/auth.css";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("user");
  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!name) newErrors.name = "Name is required";

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (role === "admin" && !adminKey) {
      newErrors.adminKey = "Admin key is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validate()) return;
    try {
      setLoading(true);

      const payload = {
        name,
        email,
        password,
        role,
      };

      // if admin → send adminKey
      if (role === "admin") {
        payload.adminKey = adminKey;
      }

      const data = await registerUser(payload);
      toast.success("Register successful 🚀");

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Tabs */}
      <div className="auth-tabs">
        <Link to="/login" className="tab">
          Sign In
        </Link>
        <button className="tab active">Register</button>
      </div>

      {/* Role Selection */}
      <div className="role-selector">
        <div
          className={`role-card ${role === "user" ? "active-role" : ""}`}
          onClick={() => setRole("user")}
        >
          <h4>User</h4>
          <p>Book & manage slots</p>
        </div>

        <div
          className={`role-card ${role === "admin" ? "active-role" : ""}`}
          onClick={() => setRole("admin")}
        >
          <h4>Admin</h4>
          <p>Manage the system</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSignup}>
        <input
          className={`auth-input ${errors.name ? "input-error" : ""}`}
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: "" }));
          }}
        />
        {errors.name && <p className="error-text">{errors.name}</p>}

        <input
          className={`auth-input ${errors.email ? "input-error" : ""}`}
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        <div className="password-field">
          <input
            className={`auth-input ${errors.password ? "input-error" : ""}`}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>
        {errors.password && <p className="error-text">{errors.password}</p>}

        {role === "admin" && (
          <>
            <input
              className={`auth-input ${errors.name ? "input-error" : ""}`}
              type="password"
              placeholder="Admin Registration Key"
              value={adminKey}
              onChange={(e) => {
                setAdminKey(e.target.value);
                setErrors((prev) => ({ ...prev, adminKey: "" }));
              }}
            />
            {errors.adminKey && <p className="error-text">{errors.adminKey}</p>}
          </>
        )}

        <button className="auth-button" disabled={loading}>
          {loading
            ? "Creating Account..."
            : `Register as ${role === "admin" ? "Admin" : "User"} →`}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
