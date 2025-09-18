import { createBrowserRouter } from "react-router";
import Mainlayout from "./layout/Mainlayout";
<<<<<<< HEAD
import LoginPage from "./page/login/LoginPage";
=======
import About from "./page/about/About";
import Home from "./page/home/Home";


>>>>>>> 351045901fc6cbc301000e10425ef5e5938bbcb7

const router = createBrowserRouter([
  {
    path: "/",
    Component: Mainlayout,
    children: [
      {
<<<<<<< HEAD
        path: '/login',
        Component: LoginPage
      }
    ]
=======
        index: true,
        Component: Home,
        
    },
      {
        path: "about",
        Component: About,
      }],
>>>>>>> 351045901fc6cbc301000e10425ef5e5938bbcb7
  },
 
]);

export default router;