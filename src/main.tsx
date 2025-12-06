import { createRoot } from "react-dom/client";
import "./index.css";
import { Register } from "./components/Register/Register.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Login } from "./components/Login/Login.tsx";
import { Profile } from "./components/Profile/Profile.tsx";
import { AccountList } from "./components/AccountList/AccountList.tsx";

const router = createBrowserRouter([
  {
    path: "/page/register",
    element: <Register />,
  },
  {
    path: "page/login",
    element: <Login />,
  },
  {
    path: "page/profile",
    element: <Profile />,
  },
  {
    path: "page/accounts-list",
    element: <AccountList />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
