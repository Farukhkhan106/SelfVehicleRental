import React from "react";
import Navbar from "./Common/Navbar";
import {
  FaCar,
  FaBiking,
  FaShieldAlt,
  FaSearchDollar,
  FaUsers,
  FaHandshake,
  FaGlobe,
} from "react-icons/fa";
import "./Home.css";

const Home = () => {
  const features = [
    {
      title: "Earn with Your Vehicle",
      description:
        "If you own a vehicle that is not in regular use, you can upload it to our platform and start earning money by renting it out safely.",
      icon: <FaCar size={50} />,
    },
    {
      title: "Find Your Perfect Ride",
      description:
        "Need a vehicle for a trip, local travel, or business purpose? Choose from a range of cars, bikes, or SUVs available for rent.",
      icon: <FaBiking size={50} />,
    },
    {
      title: "Secure and Reliable",
      description:
        "Our platform ensures secure transactions, verified users, and safety measures to provide a hassle-free rental experience.",
      icon: <FaShieldAlt size={50} />,
    },
    {
      title: "Flexible Rent Options",
      description:
        "Search vehicles based on your budget. Find the best options within your preferred rental range.",
      icon: <FaSearchDollar size={50} />,
    },
    {
      title: "Community Driven",
      description:
        "Join a community of vehicle owners and renters, promoting shared mobility and responsible vehicle usage.",
      icon: <FaUsers size={50} />,
    },
    {
      title: "Trust and Transparency",
      description:
        "We believe in transparent pricing and honest reviews for both renters and owners.",
      icon: <FaHandshake size={50} />,
    },
    {
      title: "Global Reach",
      description:
        "Explore vehicles available in different regions and experience a seamless cross-city and cross-country rental service.",
      icon: <FaGlobe size={50} />,
    },
  ];

  return (
    <div className="home-container">
      {/* Navbar */}
      <Navbar />

      {/* Welcome Section */}
      <section className="welcome-section">
        <h1>Welcome to Vehicle Rent Service</h1>
        <p>Your one-stop solution for renting and earning with vehicles.</p>
      </section>

      {/* Video Section */}
      <section className="video-section">
        <video autoPlay loop muted className="background-video">
          <source src="/videos/background-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Our Features</h2>
        <div className="features-container">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              {feature.icon}
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Purpose Section */}
      <section className="purpose-card">
        <h2>Our Purpose</h2>
        <p>
          Our goal is to create a seamless and secure platform where vehicle
          owners can earn by renting out their unused vehicles, and users can
          easily find reliable and affordable transportation for their travel
          needs. We are committed to providing a trustworthy environment with
          verified users and vehicles, ensuring a stress-free experience for
          all.
        </p>
      </section>

      {/* CTA */}
      <div className="cta-section">
        <p>
          Please <a href="/login">Login</a> or <a href="/register">Signup</a> to
          continue and access all features.
        </p>
      </div>

      {/* Footer */}
      <footer>
        &copy; {new Date().getFullYear()} Vehicle Rent Service. All rights
        reserved.
      </footer>
    </div>
  );
};

export default Home;
