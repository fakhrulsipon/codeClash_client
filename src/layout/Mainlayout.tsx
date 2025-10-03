import { Outlet } from "react-router";
import Navbar from "../page/home/Navbar";
import ScrollToTop from "../components/ScrollToTop";

const Mainlayout = () => {
  return (
    <div>
      <Navbar />
      <ScrollToTop></ScrollToTop>
      <main className="bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-400">
        <Outlet />
      </main>
    </div>
  );
};

export default Mainlayout;
