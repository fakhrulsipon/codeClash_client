import { Outlet } from "react-router";
import Navbar from "../page/home/Navbar";
import ScrollToTop from "../components/ScrollToTop";

const Mainlayout = () => {
  return (
    <div>
      <Navbar />
      <ScrollToTop></ScrollToTop>
      <main className=" bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Outlet />
      </main>
    </div>
  );
};

export default Mainlayout;
