import React, { useState } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import {
  sendResetOtp,
  verifyResetOtp,
  resetPassword,
} from "../../services/authService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSendOtp = async () => {
    try {
      setLoading(true);

      await sendResetOtp(email);

      toast.success("OTP sent");

      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);

      await verifyResetOtp({
        email,
        otp,
      });

      toast.success("OTP verified");

      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);

      await resetPassword({
        email,
        password,
      });

      toast.success("Password reset successful");

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-tabs">
        <button className="tab active">Forgot Password</button>
      </div>

      {step === 1 && (
        <>
          <input
            className="auth-input"
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="auth-button" onClick={handleSendOtp}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            className="auth-input"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button className="auth-button" onClick={handleVerifyOtp}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <div className="password-field">
            <input
              className="auth-input"
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          <button className="auth-button" onClick={handleResetPassword}>
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
