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
import JoinContest from "./page/contests/JoinContest";
import ContestLobby from "./page/contests/ContestLobby";
import ContestWorkspace from "./page/contests/ContestWorkspace";
import CreactePrombels from "./createProblems/createProblems";
import ProfilePage from "./page/profile/ProfilePage";


  const user = {
    name: "Rifat Hasan",
    email: "rifat@example.com",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    stats: {
      problemsSolved: 35,
      challengesParticipated: 10,
      teams: 3,
    },

  };
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
        path: "contests/:contestId/join",
        element: <JoinContest></JoinContest>,
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
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
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
        element: <AddContest />,
      },
      {
        path: "createProblems",
        element: <CreactePrombels />,
      },
      {
        path: "/dashboard/profile",
        element: <ProfilePage {...user} />,
      },
    ],
  },
  {
    path: "/*",
    element: <Error />,
  },
]);

export default router;
