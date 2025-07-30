// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { api } from '../axiosConfig';

// const Dashboard = () => {
//   const [vehicles, setVehicles] = useState([]);
//   const [user, setUser] = useState({});
//   const navigate = useNavigate();

//   // Fetch User Data and Vehicles on Load
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           alert('Please login first');
//           navigate('/');
//           return;
//         }
//         const userResponse = await api.get('/user/me');
//         setUser(userResponse.data);

//         const vehiclesResponse = await api.get('/vehicles');
//         setVehicles(vehiclesResponse.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
//     fetchData();
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/');
//   };

//   return (
//     <div className="dashboard">
//       <h1>Welcome, {user.name || 'User'}!</h1>
//       <button onClick={handleLogout} className="logout-btn">Logout</button>

//       <h2>Available Vehicles</h2>
//       <ul>
//         {vehicles.map((vehicle) => (
//           <li key={vehicle.id}>
//             {vehicle.name} - {vehicle.type} - ₹{vehicle.price}/day
//             <button>Book Now</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Dashboard;
