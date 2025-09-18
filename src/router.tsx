import { createBrowserRouter } from "react-router";
import Mainlayout from "./layout/Mainlayout";
import About from "./page/about/About";
import Home from "./page/home/Home";
import LoginPage from "./page/login/LoginPage";
import RegisterPage from "./page/login/RegisterPage";



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
    }
  ],
  },
 
]);

export default router;