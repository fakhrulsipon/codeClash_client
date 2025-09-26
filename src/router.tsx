import { createBrowserRouter } from "react-router";
import Mainlayout from "./layout/Mainlayout";
import About from "./page/about/About";
import Home from "./page/home/Home";
import LoginPage from "./page/login/LoginPage";
import RegisterPage from "./page/login/RegisterPage";
import Problems from "./page/Problems/Problems";
import ForgotPasswordPage from "./page/login/ForgotPasswordPage";
import PrivetRoute from "./route/PrivetRoute";

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
        element: <PrivetRoute><Problems></Problems></PrivetRoute>
      },
      {
        path: "about",
        Component: About,
      },
    {
      path: 'login',
      Component: LoginPage
    },
    {
      path: 'register',
      Component: RegisterPage
    },
    {
      path: '/forgot-password',
      element: <ForgotPasswordPage></ForgotPasswordPage>
    }

  ],
  },
]);

export default router;
