import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import SlotMonitor from "./pages/admin/slot-monitor/SlotMonitor";
import AnprMonitor from "./pages/admin/anpr/AnprMonitor";
import Transactions from "./pages/admin/transactions/Transactions";
import ManageUsers from "./pages/admin/users/ManageUsers";
import Reports from "./pages/admin/reports/Reports";

import BookingHistory from "./pages/user/bookings/BookingHistory";
import UserDashboard from "./pages/user/dashboard/UserDashboard";
import BookSlot from "./pages/user/parking/BookSlot";
import FindParking from "./pages/user/parking/FindParking";
import FindParkingNearMe from "./pages/user/parking/FindParkingNearMe";
import UserProfile from "./pages/user/profile/UserProfile";

import Landing from "./pages/Landing";

import PrivateRoute from "./routes/PrivateRoute";
import { Toaster } from "react-hot-toast";
import UserProvider, { UserContext } from "./context/userContext";
import AddMoney from "./pages/user/profile/AddMoney";
import WalletTransactions from "./pages/user/profile/WalletTransactions";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* AUTH ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ADMIN ROUTES */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/slot-monitor" element={<SlotMonitor />} />
            <Route path="/admin/anpr-monitor" element={<AnprMonitor />} />
            <Route path="/admin/transactions" element={<Transactions />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/reports" element={<Reports />} />
          </Route>

          {/* USER ROUTES */}
          <Route element={<PrivateRoute allowedRoles={["user"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/find-parking" element={<FindParking />} />
            <Route path="/user/book-parking/:slotId" element={<BookSlot />} />
            <Route
              path="/user/find-parking-near-me"
              element={<FindParkingNearMe />}
            />
            <Route path="/user/bookings" element={<BookingHistory />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/add-money" element={<AddMoney />} />
            <Route
              path="/user/wallet-transactions"
              element={<WalletTransactions />}
            />
          </Route>

          {/* ROOT */}
          {/* <Route path="/" element={<Root />} /> */}
          <Route path="/" element={<Landing />} />
        </Routes>
      </Router>

      <Toaster
        toastOptions={{
          style: { fontSize: "13px" },
        }}
      />
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Outlet />;
  if (!user) {
    return <Navigate to="/login" />;
  }

  return user.role === "admin" ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/user/dashboard" />
  );
};
