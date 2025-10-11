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
import PrivetRoute from "./route/PrivetRoute";
import ForgotPasswordPage from "./page/login/ForgotPasswordPage";
import AllContests from "./page/contests/AllContests";
import ContestDetails from "./page/contests/ContestDetails";
import ContestLobby from "./page/contests/ContestLobby";
import ContestWorkspace from "./page/contests/ContestWorkspace";
import SolveProblem from "./page/SolveProblem";
import Profile from "./page/Profile";
import History from "./page/History";
import ManageContests from "./page/dashboard/manageContests/ManageContests";
import  AdminRoute from "./route/AdminRoute";
import ForbiddenPage from "./page/ForbiddenPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "problems",
        element: (
          <PrivetRoute>
            <Problems />
          </PrivetRoute>
        ),
      },
      {
        path: "all-contests",
        element: <AllContests></AllContests>,
      },
      {
        path: "/contests/:id",
        element: (
          <PrivetRoute>
            <ContestDetails></ContestDetails>
          </PrivetRoute>
        ),
      },
      {
        path: "contests/:contestId/lobby",
        element: <ContestLobby></ContestLobby>,
      },
      {
        path: "contests/:contestId/workspace",
        element: <ContestWorkspace></ContestWorkspace>,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: '/forbidden',
        element: <ForbiddenPage/>
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "problems/:id",
        element: (
          <PrivetRoute>
            <SolveProblem />
          </PrivetRoute>
        ),
      },
      {
        path: 'profile',
        element: <PrivetRoute><Profile/></PrivetRoute>
      },
      {
        path: 'history',
        element: <PrivetRoute><History/></PrivetRoute>
      }
    ],
  },

  // ========= admin dashboard ===========
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "addContest",
        element: <AdminRoute><AddContest /></AdminRoute>,
      },
      {
        path: "/dashboard/manageContests",
        element:<ManageContests />,
      },
    ],
  },
  {
    path: "/*",
    element: <Error />,
  },
]);

export default router;
