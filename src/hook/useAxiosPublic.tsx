import axios from "axios";

const axiosPublic = axios.create({
    baseURL: `https://code-clash-server-rust.vercel.app`
})

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;