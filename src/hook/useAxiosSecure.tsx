import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { use} from "react";
import { AuthContext } from "../provider/AuthProvider";

type CustomUser = {
  email: string;
  displayName?: string;
  accessToken?: string;
};

interface AuthContextType {
  user: CustomUser | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<CustomUser | null>>;
}

const axiosSecure: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

const useAxiosSecure = (): AxiosInstance => {
  const { user } = use(AuthContext) as AuthContextType;

  axiosSecure.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      
        config.headers.Authorization = `Bearer ${user?.accessToken}`;
      
      return config;
    },
    (error) => Promise.reject(error)
  );

  return axiosSecure;
};

export default useAxiosSecure;
