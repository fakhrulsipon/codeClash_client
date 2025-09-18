import { createBrowserRouter } from "react-router";
import Mainlayout from "./layout/Mainlayout";



const router = createBrowserRouter([
  {
    path: "/",
    Component: Mainlayout,
  },
]);

export default router;