import React, { useEffect, useState } from 'react';
import { api } from '../../axiosConfig';
import UserNavbar from '../../components/Common/UserNavbar';
import '../Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/user/profile');
        setUser(response.data);
      } catch (err) {
        setError('❌ Failed to fetch profile. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div>
      <UserNavbar />
      <div className="profile-container">
        <h1>👤 My Profile</h1>

        {loading && <p className="loading">Loading profile...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && user && (
  <div className="profile-card">
    <table className="profile-table">
      <tbody>
        <tr><td><strong>Name</strong></td><td>{user.name}</td></tr>
        <tr><td><strong>Email</strong></td><td>{user.email}</td></tr>
        <tr><td><strong>Phone</strong></td><td>{user.phone || 'Not Provided'}</td></tr>
        <tr><td><strong>Address</strong></td><td>{user.address || 'Not Provided'}</td></tr>
        <tr><td><strong>City</strong></td><td>{user.city || 'Not Provided'}</td></tr>
        <tr><td><strong>State</strong></td><td>{user.state || 'Not Provided'}</td></tr>
        <tr><td><strong>Role</strong></td><td>{user.role}</td></tr>
      </tbody>
    </table>
  </div>
)}


        {!loading && !error && !user && (
          <p className="error">No profile information available.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
