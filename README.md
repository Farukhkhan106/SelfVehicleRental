# 🚗 Self Rental Vehicle System  

A full-stack web application that allows users to rent vehicles (cars, bikes, and transport vehicles) for self-driving purposes.  
The system supports **three roles**:  

- 👤 **User** → Explore vehicles, book for a time slot, and make payments.  
- 🚙 **Owner** → Upload/manage their vehicles and earn income.  
- 🛠️ **Admin** → Manage users, vehicles, and bookings.  

---

## ✨ Features  

### 👤 User Features  
- Browse/search vehicles by category (car, bike, transport).  
- View vehicle details with images and price per day.  
- Book vehicles with start and end dates.  
- Secure payments via Razorpay integration.  
- Manage bookings and view history.  

### 🚙 Owner Features  
- Upload vehicles with details (brand, model, type, price, and photos).  
- Manage vehicles (edit, delete).  
- Track bookings for their vehicles.  
- View income reports.  

### 🛠️ Admin Features  
- Approve/reject vehicles uploaded by owners.  
- Manage users, owners, and vehicles.  
- Oversee all bookings and transactions.  
- Ensure data consistency and platform security.  

---

## 🏗️ System Architecture  

- **Frontend**: React.js (with React Router, Axios for API calls)  
- **Backend**: Spring Boot (REST APIs, role-based authentication with JWT)  
- **Database**: MySQL (relational DB with structured schema)  
- **Payment Gateway**: Razorpay API for secure transactions  
- **Storage**: Vehicle photo upload & storage on server (with validation)  

---

## 🛡️ Authentication & Security  

- **JWT (JSON Web Token)** for secure login and role-based access (User, Owner, Admin).  
- Passwords stored securely using hashing.  
- Role-based route protection in both frontend and backend.  
- Payment verification via Razorpay signature validation.  

---

## 📊 Database Design (ERD Overview)  

- **User** (user_id, name, email, password, role)  
- **Vehicle** (vehicle_id, owner_id, brand, model, type, price_per_day, status, photo_url)  
- **Booking** (booking_id, user_id, vehicle_id, start_date, end_date, status)  
- **Payment** (payment_id, booking_id, amount, status, transaction_id)  

Relationships:  
- One **User** can create many **Bookings**.  
- One **Owner** (User with role=OWNER) can upload many **Vehicles**.  
- One **Vehicle** can have many **Bookings**.  
- One **Booking** is linked to one **Payment**.  

---

## 🔄 Workflow  

1. **User** signs up/logs in.  
2. **Owner** uploads vehicle → **Admin** approves/rejects.  
3. **User** browses and books a vehicle.  
4. **Payment** is processed via Razorpay.  
5. **Booking confirmation** is generated.  
6. **Admin** monitors all activities.


 Clone the repo  

git clone [https://github.com/your-username/self-rental-vehicle-system.git](https://github.com/Farukhkhan106/SelfVehicleRental)


Database (MySQL)

Create a schema self_rental_db.
Update application.properties with DB credentials.
Run the project to auto-generate tables.

💳 Payment Integration

Integrated Razorpay Payment Gateway.
Supports test mode (sandbox) and live transactions.
Server verifies payments using Razorpay signature verification to prevent fraud.

🚀 Future Enhancements

Add mobile app support.
Implement loyalty points for frequent users.
Provide subscription plans for owners.
Add live GPS tracking of vehicles.
Multi-language and multi-currency support.

📌 Tech Stack

Frontend: React.js, Axios, Tailwind CSS
Backend: Spring Boot, Spring Security, JWT
Database: MySQL
Payment Gateway: Razorpay
Build Tools: Maven, npm

👨‍💻 Authors

Your Name – Full Stack Developer
