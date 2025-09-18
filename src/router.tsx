import { createBrowserRouter } from "react-router";
import Mainlayout from "./layout/Mainlayout";
import About from "./page/about/About";



const router = createBrowserRouter([
  {
    path: "/",
    Component: Mainlayout,
    children: [
      {
        index: true,
        Component: Mainlayout,
        
    },
      {
        path: "about",
        Component: About,
      }],
  },
 
]);

export default router;