import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { AddUserModal } from "../../../components/common/AdminModal";
import { getAllUsers } from "../../../services/adminService";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();

      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="admin-users-page">
        {/* HEADER */}

        <div className="admin-users-header">
          <div>
            <h1>User Management</h1>

            <p>{users.length} total accounts</p>
          </div>
          <button
            className="admin-add-user-btn"
            onClick={() => setOpenModal(true)}
          >
            + Add User
          </button>
        </div>

        {/* LIST */}

        <div className="admin-users-list">
          {users.map((user) => (
            <div className="admin-user-card" key={user._id}>
              {/* LEFT */}

              <div className="admin-user-left">
                <div className="admin-user-avatar">
                  {getInitials(user.name)}
                </div>

                <div>
                  <h3>{user.name}</h3>

                  <p>{user.email}</p>
                </div>
              </div>

              {/* RIGHT */}

              <div className="admin-user-right">
                <div className="admin-user-stats">
                  <span>{user.totalBookings} bookings</span>

                  <h4>Rs {user.totalSpent} spent</h4>
                </div>

                <div className="admin-user-status active">Active</div>

                <button className="admin-user-btn edit">Edit</button>

                <button className="admin-user-btn block">Block</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddUserModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        refresh={fetchUsers}
      />
    </DashboardLayout>
  );
};

export default Users;
