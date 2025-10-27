import { createBrowserRouter } from "react-router";
import Mainlayout from "./layout/Mainlayout";
import About from "./page/about/About";
import Home from "./page/home/Home";
import LoginPage from "./page/login/LoginPage";
import RegisterPage from "./page/login/RegisterPage";
import Problems from "./page/Problems/Problems";
import DashboardLayout from "./layout/DashboardLayout";
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
import ManageContests from "./page/dashboard/manageContests/ManageContests";
import AddProblem from "./page/dashboard/addProblem/AddProblem";
import AdminRoute from "./route/AdminRoute";
import ManageUsers from "./page/dashboard/manageUsers/ManageUsers";
import ManageTeams from "./page/dashboard/manageTeams/ManageTeams";
import ManageParticipants from "./page/dashboard/manageParticipants/ManageParticipants";
import History from "./page/History";
import Leaderboard from "./page/dashboard/Leaderboard";

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
        element: <Problems />,
      },
      {
        path: "all-contests",
        element: <AllContests />,
      },
      {
        path: "/contests/:id",
        element: <ContestDetails></ContestDetails>,
      },
      {
        path: "contests/:contestId/lobby",
        element: (
          <PrivetRoute>
            <ContestLobby />
          </PrivetRoute>
        ),
      },
      {
        path: "contests/:contestId/workspace",
        element: (
          <PrivetRoute>
            <ContestWorkspace />
          </PrivetRoute>
        ),
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
    ],
  },

  // ========= admin dashboard ===========
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "leaderboard",
        element: (
          <PrivetRoute>
            <Leaderboard />
          </PrivetRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivetRoute>
            <Profile />
          </PrivetRoute>
        ),
      },
      {
        path: "history",
        element: (
          <PrivetRoute>
            <History />
          </PrivetRoute>
        ),
      },
      {
        path: "addContest",
        element: (
          <AdminRoute>
            <AddContest />
          </AdminRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "manageContests",
        element: (
          <AdminRoute>
            <ManageContests />
          </AdminRoute>
        ),
      },
      {
        path: "addProblem",
        element: (
          <AdminRoute>
            <AddProblem />
          </AdminRoute>
        ),
      },
      {
        path: "manageContests",
        element: (
          <AdminRoute>
            <ManageContests />
          </AdminRoute>
        ),
      },
      {
        path: "manageTeams",
        element: (
          <AdminRoute>
            <ManageTeams />
          </AdminRoute>
        ),
      },
      {
        path: "manageParticipants",
        element: (
          <AdminRoute>
            <ManageParticipants />
          </AdminRoute>
        ),
      },
    ],
  },
  {
    path: "/*",
    element: <Error />,
  },
]);

export default router;
