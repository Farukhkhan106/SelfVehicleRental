import React, { useState, useEffect } from 'react';
import { api } from '../../axiosConfig';
import OwnerNavbar from '../Common/OwnerNavbar';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import '../Profile.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OwnerProfile = () => {
  const [ownerInfo, setOwnerInfo] = useState({ name: '', email: '', phone: '' });
  const [ownerDetails, setOwnerDetails] = useState({
    bankName: '', accountNumber: '', ifscCode: '', aadhaarNumber: '', panNumber: ''
  });
  const [earnings, setEarnings] = useState({
    totalMonthly: 0, totalYearly: 0, lifetime: 0, pendingPayout: 0, perVehicle: []
  });
  const [documents, setDocuments] = useState({ rcDoc: null, insuranceDoc: null, permitDoc: null });
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/owner/profile');
        setOwnerInfo(res.data?.ownerInfo ?? {});
        setOwnerDetails(res.data?.ownerExtra ?? {});
        setEarnings(res.data?.earnings ?? {});
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setOwnerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setOwnerDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleDocUpload = (e) => {
    const { name, files } = e.target;
    setDocuments(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMsg('');

    try {
      await api.put('/owner/update-profile', { ...ownerInfo, ...ownerDetails });

      const formData = new FormData();
      Object.keys(documents).forEach(docKey => {
        if (documents[docKey]) formData.append(docKey, documents[docKey]);
      });

      if (["rcDoc", "insuranceDoc", "permitDoc"].some(doc => formData.has(doc))) {
        await api.post('/owner/upload-docs', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setMsg('✅ Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setMsg('❌ Failed to update profile');
    } finally {
      setFormLoading(false);
    }
  };

  const earningsChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Earnings (₹)',
      data: [40000, 45000, 50000, 55000, 52000, 60000],
      backgroundColor: 'rgba(59, 130, 246, 0.5)'
    }]
  };

  const Input = ({ label, ...props }) => (
    <div className="input-group">
      <label>{label}</label>
      <input {...props} />
    </div>
  );

  return (
    <div>
      <OwnerNavbar />
      <div className="profile-advanced-container">
        {loading ? (
          <p className="loading">Loading owner profile...</p>
        ) : (
          <>
            <div className="left-panel">
              <h2>👤 Owner Information</h2>
              <table className="profile-table">
                <tbody>
                  <tr><td><strong>Name</strong></td><td>{ownerInfo.name || 'N/A'}</td></tr>
                  <tr><td><strong>Email</strong></td><td>{ownerInfo.email || 'N/A'}</td></tr>
                  <tr><td><strong>Phone</strong></td><td>{ownerInfo.phone || 'N/A'}</td></tr>
                </tbody>
              </table>

              <h3>🏦 Bank & KYC Details</h3>
              <table className="profile-table">
                <tbody>
                  <tr><td><strong>Bank Name</strong></td><td>{ownerDetails.bankName || 'N/A'}</td></tr>
                  <tr><td><strong>Account Number</strong></td><td>{ownerDetails.accountNumber || 'N/A'}</td></tr>
                  <tr><td><strong>IFSC</strong></td><td>{ownerDetails.ifscCode || 'N/A'}</td></tr>
                  <tr><td><strong>Aadhaar</strong></td><td>{ownerDetails.aadhaarNumber || 'N/A'}</td></tr>
                  <tr><td><strong>PAN</strong></td><td>{ownerDetails.panNumber || 'N/A'}</td></tr>
                </tbody>
              </table>

              <h3>💰 Per Vehicle Earnings</h3>
              <ul>
                {earnings.perVehicle.map((v, i) => (
                  <li key={i}>{v.vehicle}: ₹{v.earnings.toLocaleString()}</li>
                ))}
              </ul>
            </div>

            <div className="right-panel">
              <div className="stats-box">
                <div className="stat"><div className="stat-label">Monthly</div><div className="stat-value">₹{earnings.totalMonthly.toLocaleString()}</div></div>
                <div className="stat"><div className="stat-label">Yearly</div><div className="stat-value">₹{earnings.totalYearly.toLocaleString()}</div></div>
                <div className="stat"><div className="stat-label">Lifetime</div><div className="stat-value">₹{earnings.lifetime.toLocaleString()}</div></div>
                <div className="stat"><div className="stat-label">Pending</div><div className="stat-value">₹{earnings.pendingPayout.toLocaleString()}</div></div>
              </div>

              <div className="chart-container">
                <Bar data={earningsChartData} />
              </div>

              <form className="advanced-form" onSubmit={handleSave} encType="multipart/form-data">
                <h3>✏️ Edit Profile</h3>
                <Input label="Name" name="name" value={ownerInfo.name} onChange={handleInfoChange} />
                <Input label="Email" name="email" type="email" value={ownerInfo.email} onChange={handleInfoChange} />
                <Input label="Phone" name="phone" value={ownerInfo.phone} onChange={handleInfoChange} />

                <h3>🏦 Bank & KYC</h3>
                <Input label="Bank Name" name="bankName" value={ownerDetails.bankName} onChange={handleDetailsChange} />
                <Input label="Account Number" name="accountNumber" value={ownerDetails.accountNumber} onChange={handleDetailsChange} />
                <Input label="IFSC Code" name="ifscCode" value={ownerDetails.ifscCode} onChange={handleDetailsChange} />
                <Input label="Aadhaar Number" name="aadhaarNumber" value={ownerDetails.aadhaarNumber} onChange={handleDetailsChange} />
                <Input label="PAN Number" name="panNumber" value={ownerDetails.panNumber} onChange={handleDetailsChange} />

                <h3>📤 Upload Documents</h3>
                <Input label="RC Document" type="file" name="rcDoc" onChange={handleDocUpload} />
                <Input label="Insurance Document" type="file" name="insuranceDoc" onChange={handleDocUpload} />
                <Input label="Permit Document" type="file" name="permitDoc" onChange={handleDocUpload} />

                <button type="submit" className="btn" disabled={formLoading}>
                  {formLoading ? 'Saving...' : '💾 Save Profile'}
                </button>
                {msg && <p className="message">{msg}</p>}
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OwnerProfile;
