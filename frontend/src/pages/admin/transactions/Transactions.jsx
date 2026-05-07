import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import {
  getAllTransactions,
  downloadRevenueReport,
} from "../../../services/adminService";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await getAllTransactions();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const data = await downloadRevenueReport();

      const url = window.URL.createObjectURL(new Blob([data]));

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute("download", "transaction_report.csv");

      document.body.appendChild(link);

      link.click();

      link.remove();
    } catch (error) {
      console.error(error);
      alert("Download failed");
    }
  };

  const totalRevenue = transactions.reduce((acc, item) => acc + item.amount, 0);
  const active = transactions.filter((t) => t.status === "active").length;
  const completed = transactions.filter((t) => t.status === "completed").length;

  return (
    <DashboardLayout>
      <div className="admin-transactions-page">
        {/* TOP CARDS */}

        <div className="admin-transaction-top">
          <div className="admin-transaction-stats">
            <div className="admin-transaction-card">
              <h2>₹{totalRevenue}</h2>
              <p>Total Revenue</p>
            </div>

            <div className="admin-transaction-card">
              <h2>{transactions.length}</h2>
              <p>Total Records</p>
            </div>

            <div className="admin-transaction-card">
              <h2>{active}</h2>
              <p>Active</p>
            </div>

            <div className="admin-transaction-card">
              <h2>{completed}</h2>
              <p>Completed</p>
            </div>
          </div>
          <button className="export-btn" onClick={handleDownloadReport}>
            Export Transaction Report
          </button>
        </div>

        {/* TABLE */}

        <div className="admin-transactions-table">
          <div className="admin-transactions-header">
            <span>SLOT</span>
            <span>USER</span>
            <span>VEHICLE</span>
            <span>ENTRY</span>
            <span>EXIT</span>
            <span>HRS</span>
            <span>AMOUNT</span>
            <span>STATUS</span>
          </div>

          {transactions.map((t) => (
            <div key={t._id} className="admin-transaction-row">
              <span className="slot-pill">{t.slot}</span>

              <span>{t.user}</span>

              <span>{t.vehicle}</span>

              <span>{new Date(t.entryTime).toLocaleTimeString()}</span>

              <span>
                {t.exitTime ? new Date(t.exitTime).toLocaleTimeString() : "--"}
              </span>

              <span>{(t.duration / 3600).toFixed(1)}</span>

              <span className="amount">₹{t.amount}</span>

              <span className={`status ${t.status}`}>{t.status}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
