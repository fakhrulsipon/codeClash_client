import { createBrowserRouter } from "react-router";
import Mainlayout from "./layout/Mainlayout";
import About from "./page/about/About";
import Home from "./page/home/Home";

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
      }],
  },
 
]);

export default router;
