import { Outlet } from "react-router";
import Navbar from "../page/home/Navbar";

const Mainlayout = () => {
  return (
    <div>
      <Navbar />
      <main className="bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-400">
        <Outlet />
      </main>
    </div>
  );
};

export default Mainlayout;
