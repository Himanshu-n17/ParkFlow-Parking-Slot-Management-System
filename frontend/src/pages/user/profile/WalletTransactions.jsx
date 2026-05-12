import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { getWalletTransactions } from "../../../services/userService";

const WalletTransactions = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await getWalletTransactions(user._id);

      setTransactions(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="wallet-transactions-page">
        <div className="wallet-transactions-list">
          {transactions.map((item, index) => (
            <div className="wallet-transaction-card" key={index}>
              <div className="wallet-transaction-left">
                <div className={`wallet-transaction-icon ${item.status}`}>
                  {item.status === "credit" && "↗"}
                  {item.status === "debit" && "↘"}
                  {item.status === "failed" && "⚠"}
                </div>

                <div>
                  <h3>{item.type}</h3>

                  <p>{new Date(item.date).toLocaleString()}</p>
                </div>
              </div>

              <div className="wallet-transaction-right">
                <h2
                  className={
                    item.status === "credit"
                      ? "credit"
                      : item.status === "failed"
                        ? "failed"
                        : "debit"
                  }
                >
                  {item.status === "credit" ? "+" : "-"}₹{item.amount}
                </h2>

                {item.vehicleNumber && <span>{item.vehicleNumber}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WalletTransactions;
