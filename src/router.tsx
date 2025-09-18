import { createBrowserRouter } from "react-router";
import Mainlayout from "./layout/Mainlayout";
import LoginPage from "./page/login/LoginPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Mainlayout,
    children: [
      {
        path: '/login',
        Component: LoginPage
      }
    ]
  },
]);

export default router;