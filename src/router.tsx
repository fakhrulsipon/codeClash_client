import { createBrowserRouter } from "react-router";
import Mainlayout from "./layout/Mainlayout";
import About from "./page/about/About";
import Home from "./page/home/Home";
import LoginPage from "./page/login/LoginPage";
import RegisterPage from "./page/login/RegisterPage";
import Problems from "./page/Problems/Problems";
import DashboardLayout from "./layout/DashboardLayout";
import DashboardHome from "./page/dashboard/dashboardHome/DashboardHome";
import Error from "./page/error/Error";
import AddContest from "./page/dashboard/addContest/AddContest";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Mainlayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "problems",
        Component: Problems,
      },
      {
        path: "about",
        Component: About,
      },
      {
        path: "login",
        Component: LoginPage,
      },
      {
        path: "register",
        Component: RegisterPage,
      },
      // {
      //   path: '/forgot-password',
      //   element: <ForgotPasswordPage></ForgotPasswordPage>
      // }
    ],
  },

  // =========admin dashboard===========
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: "addContest",
        Component: AddContest,
      },
    ],
  },
  // =========admin dashboard===========
  {
    path: "/*",
    Component: Error,
  },
]);

export default router;
