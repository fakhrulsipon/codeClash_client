import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { use} from "react";
import { AuthContext } from "../provider/AuthProvider";
import { useNavigate } from "react-router";

type CustomUser = {
  email: string;
  displayName?: string;
  accessToken?: string;
};

interface AuthContextType {
  user: CustomUser | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<CustomUser | null>>;
  logoutUser: () => Promise<void>;
}

const axiosSecure: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

const useAxiosSecure = (): AxiosInstance => {
  const { user, logoutUser } = use(AuthContext) as AuthContextType;
  const navigate = useNavigate();

  axiosSecure.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      
        config.headers.Authorization = `Bearer ${user?.accessToken}`;
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  axiosSecure.interceptors.response.use(res => {
    return res;
  }, error => {
    const status = error.status;
    if(status === 403) {
      navigate('/forbidden')
    } else if(status === 401){
      logoutUser()
      .then(() => {
        navigate('/login')
      })
      .catch(() => {})
    }
  })

  return axiosSecure;
};

export default useAxiosSecure;
