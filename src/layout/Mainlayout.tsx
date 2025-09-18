import { Outlet } from "react-router";
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