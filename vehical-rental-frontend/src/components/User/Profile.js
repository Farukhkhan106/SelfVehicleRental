import React, { useEffect, useState } from "react";
import { api } from "../../axiosConfig";
import UserNavbar from "../../components/Common/UserNavbar";
import "../Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileMsg, setProfileMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const [editData, setEditData] = useState({});
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const fetchProfileAndBookings = async () => {
      try {
        const profileRes = await api.get("/user/profile");
        const userData = profileRes.data;
        setUser(userData);
        setEditData(userData);

        if (userData.id) {
          const bookingRes = await api.get(
            `/booking/my-detailed-bookings-by-user/${userData.id}`
          );
          setBookings(bookingRes.data);
        }
      } catch (err) {
        console.error(err);
        setError("❌ Failed to load profile or bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndBookings();
  }, []);

  // Calculate stats in one pass
  const stats = bookings.reduce(
    (acc, b) => {
      const status = (b.status || "").toUpperCase();
      acc.total++;
      acc.totalAmount += Number(b.amount) || 0;
      if (status === "COMPLETED") acc.completed++;
      if (status === "CANCELED") acc.cancelled++;
      return acc;
    },
    { total: 0, completed: 0, cancelled: 0, totalAmount: 0 }
  );

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setProfileMsg("");
    try {
      await api.put("/user/update-profile", editData);
      setUser(editData);
      setProfileMsg("✅ Profile updated successfully");
    } catch (err) {
      console.error(err);
      setProfileMsg("❌ Failed to update profile");
    } finally {
      setFormLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      setPasswordMsg("❌ Please fill in both password fields");
      return;
    }
    setFormLoading(true);
    setPasswordMsg("");
    try {
      await api.put("/user/change-password", passwordData);
      setPasswordData({ oldPassword: "", newPassword: "" });
      setPasswordMsg("✅ Password changed successfully");
    } catch (err) {
      console.error(err);
      setPasswordMsg("❌ Failed to change password");
    } finally {
      setFormLoading(false);
    }
  };

  const Input = ({ label, ...props }) => (
    <div className="input-group">
      <label>{label}</label>
      <input {...props} />
    </div>
  );

  return (
    <div>
      <UserNavbar />
      <div className="profile-advanced-container">
        {loading ? (
          <p className="loading">Loading profile...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <div className="left-panel">
              <h2>👤 Profile Info</h2>
              <table className="profile-table">
                <tbody>
                  <tr>
                    <td>
                      <strong>Name</strong>
                    </td>
                    <td>{user.name}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Email</strong>
                    </td>
                    <td>{user.email}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Phone</strong>
                    </td>
                    <td>{user.phone || "Not Provided"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Address</strong>
                    </td>
                    <td>{user.address || "Not Provided"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>City</strong>
                    </td>
                    <td>{user.city || "Not Provided"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>State</strong>
                    </td>
                    <td>{user.state || "Not Provided"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Pincode</strong>
                    </td>
                    <td>{user.pincode || "Not Provided"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>About</strong>
                    </td>
                    <td>{user.about || "Not Provided"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Role</strong>
                    </td>
                    <td>{user.role}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="right-panel">
              <div className="stats-box">
                <div className="stat">
                  <div className="stat-label">Total Bookings</div>
                  <div className="stat-value">{stats.total}</div>
                </div>
                <div className="stat">
                  <div className="stat-label">Completed</div>
                  <div className="stat-value">{stats.completed}</div>
                </div>
                <div className="stat">
                  <div className="stat-label">Cancelled</div>
                  <div className="stat-value">{stats.cancelled}</div>
                </div>
                <div className="stat">
                  <div className="stat-label">Total Amount</div>
                  <div className="stat-value">
                    ₹{stats.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              <form className="advanced-form" onSubmit={handleEditSubmit}>
                <h3>✏️ Edit Profile</h3>
                <Input
                  label="Name"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  required
                />
                <Input
                  label="Phone"
                  value={editData.phone || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, phone: e.target.value })
                  }
                />
                <Input
                  label="Address"
                  value={editData.address || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, address: e.target.value })
                  }
                />
                <Input
                  label="City"
                  value={editData.city || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, city: e.target.value })
                  }
                />
                <Input
                  label="State"
                  value={editData.state || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, state: e.target.value })
                  }
                />
                <Input
                  label="Pincode"
                  value={editData.pincode || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, pincode: e.target.value })
                  }
                />
                <Input
                  label="About"
                  value={editData.about || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, about: e.target.value })
                  }
                />
                <button type="submit" className="btn" disabled={formLoading}>
                  {formLoading ? "Saving..." : "💾 Save Profile"}
                </button>
                {profileMsg && <p className="message">{profileMsg}</p>}
              </form>

              <form className="advanced-form" onSubmit={handlePasswordSubmit}>
                <h3>🔒 Change Password</h3>
                <Input
                  label="Old Password"
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                  required
                />
                <Input
                  label="New Password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />
                <button type="submit" className="btn" disabled={formLoading}>
                  {formLoading ? "Updating..." : "🔑 Update Password"}
                </button>
                {passwordMsg && <p className="message">{passwordMsg}</p>}
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
