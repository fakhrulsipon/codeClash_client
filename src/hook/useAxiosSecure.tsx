import axios from "axios";


const axiosSecure = axios.create({
  baseURL: "https://code-clash-server-rust.vercel.app",
});

const useAxiosSecure = () => {
  

  return axiosSecure;
};

export default useAxiosSecure;
