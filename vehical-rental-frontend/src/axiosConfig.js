import axios from "axios";

const API_URL = "http://localhost:8081";

// Create Axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log(
        "📌 Attached Authorization header:",
        config.headers["Authorization"]
      );
    } else {
      console.log("⚠️ No token found in localStorage");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        alert("Session expired. Please login again.");
        window.location.href = "/login";
      } else if (status === 403) {
        alert("You do not have permission to perform this action.");
        // Optionally redirect or log
        // window.location.href = '/unauthorized';
      } else {
        console.error(`❌ API Error: ${status}`, error.response.data);
      }
    } else {
      console.error("❌ Network or server error", error);
    }

    return Promise.reject(error);
  }
);

// Utility to manually set/remove Authorization header
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
    console.log("✅ Auth token set");
  } else {
    delete api.defaults.headers["Authorization"];
    localStorage.removeItem("token");
    console.log("✅ Auth token removed");
  }
};
