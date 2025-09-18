import { Outlet } from "react-router";
import Home from "../page/home/Home";
import Navbar from "../page/home/Navbar";



const Mainlayout = () => {
    return (
      <div>
        <Navbar />
        <Outlet />
        </div>
    );
};

export default Mainlayout;