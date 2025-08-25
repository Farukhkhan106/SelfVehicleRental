// const VehicleList = ({ vehicles, navigate }) => (
//   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//     {vehicles.map(vehicle => (
//       <div
//         key={vehicle.id}
//         className="border rounded-lg p-4 shadow hover:shadow-lg cursor-pointer"
//         onClick={() => navigate(`/user/vehicle/${vehicle.id}`)}
//       >
//         <img
//           src={vehicle.photoUrls?.length > 0 ? `http://localhost:8081${vehicle.photoUrls[0]}` : '/placeholder.jpg'}
//           alt={`${vehicle.brand} ${vehicle.model}`}
//           className="w-full h-48 object-cover rounded mb-2"
//           onError={(e) => e.target.src = '/placeholder.jpg'}
//         />
//         <h2 className="font-bold">{vehicle.brand} {vehicle.model}</h2>
//         <p>💰 ₹{vehicle.pricePerDay}/day</p>
//         <p>📍 {vehicle.ownerCity}</p>
//         <p className="text-sm text-muted-foreground">Click for more info</p>
//       </div>
//     ))}
//   </div>
// );

// export default VehicleList;
