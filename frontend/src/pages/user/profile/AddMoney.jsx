import React, { useState } from "react";
import { FiCreditCard } from "react-icons/fi";
import { FaGooglePay, FaUniversity } from "react-icons/fa";
import { MdQrCodeScanner } from "react-icons/md";
import { toast } from "react-toastify";
import DashboardLayout from "../../../components/layout/DashboardLayout";

const AddMoney = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    cardNumber: "",
    holderName: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddMoney = async () => {
    if (!formData.amount) {
      return toast.error("Please enter amount");
    }
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      toast.error(
        "Unable to connect with bank server. Please try again later.",
      );
    }, 2500);
  };

  return (
    <DashboardLayout>
      <div className="user-add-money-page">
        <div className="user-add-money-header">
          <p>Securely top up your ParkFlow wallet</p>
        </div>

        <div className="user-add-money-grid">
          {/* LEFT */}

          <div className="user-add-money-card">
            <div className="user-add-money-top">
              <div className="user-add-money-icon">
                <FiCreditCard />
              </div>

              <div>
                <h2>Card Payment</h2>

                <p>Visa, Mastercard, RuPay supported</p>
              </div>
            </div>

            <div className="user-add-money-form">
              <div className="user-add-money-group">
                <label>Amount</label>

                <input
                  type="number"
                  name="amount"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </div>

              <div className="user-add-money-group">
                <label>Card Number</label>

                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="user-add-money-group">
                <label>Card Holder Name</label>

                <input
                  type="text"
                  name="holderName"
                  placeholder="Enter holder name"
                  value={formData.holderName}
                  onChange={handleChange}
                />
              </div>

              <div className="user-add-money-row">
                <div className="user-add-money-group">
                  <label>Expiry</label>

                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={handleChange}
                  />
                </div>

                <div className="user-add-money-group">
                  <label>CVV</label>

                  <input
                    type="password"
                    name="cvv"
                    placeholder="***"
                    value={formData.cvv}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                className="user-add-money-btn"
                onClick={handleAddMoney}
                disabled={loading}
              >
                {loading
                  ? "Processing Payment..."
                  : `Add ₹${formData.amount || 0}`}
              </button>
            </div>
          </div>

          {/* RIGHT */}

          <div className="user-upi-payment-card">
            <div className="user-upi-header">
              <div className="user-upi-icon">
                <MdQrCodeScanner />
              </div>

              <div>
                <h2>UPI Payment</h2>

                <p>Scan QR to pay instantly</p>
              </div>
            </div>

            <div className="user-upi-qr-box">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=parkflow-wallet"
                alt="qr"
              />
            </div>

            <div className="user-upi-user-details">
              <h3>{user?.name}</h3>

              <p>parkflow@upi</p>
            </div>

            <div className="user-upi-apps">
              <div className="user-upi-app">
                <FaGooglePay />
                <span>GPay</span>
              </div>

              <div className="user-upi-app">
                <FaUniversity />
                <span>Bank UPI</span>
              </div>
            </div>

            <button
              className="user-add-money-btn upi-btn"
              onClick={handleAddMoney}
              disabled={loading}
            >
              {loading ? "Connecting Bank..." : "Confirm UPI Payment"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddMoney;
