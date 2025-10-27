import axios from "axios";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import { auth } from "../firebase/firebase.init";

// Create axios instance
const axiosSecure = axios.create({
  baseURL: "http://localhost:3000", // dynamically use backend URL
  withCredentials: true, // allow cookies if backend uses them
});

const useAxiosSecure = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Request interceptor — attach Firebase token before every request
    const requestInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        if (user) {
          try {
            // Always refresh the token (true = force refresh)
            const token = await user.getIdToken(true);
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          } catch (err) {
            console.error("🔴 Error fetching Firebase token:", err);
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor — handle unauthorized or forbidden access
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;
        const path = error?.config?.url || "";

        
        if ((status === 401 || status === 403) && !path.includes("/public")) {
          console.warn("⚠️ Unauthorized or Forbidden. Logging out user...");
          await signOut(auth);
          navigate("/login");
        }

        return Promise.reject(error);
      }
    );

    // ✅ Cleanup interceptors on unmount
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [user, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
