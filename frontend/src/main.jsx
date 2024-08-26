import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { Login } from "./components/index.js";
import AddPost from "./pages/AddPost";
import Signup from "./pages/Signup";
import EditPost from "./pages/EditPost";
import SinglePost from "./pages/SinglePost.jsx"
import Profile from "./pages/Profile.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute element={<Profile />} />
        ),
      },
      {
        path: "/add-post",
        element: (
          <ProtectedRoute element={<AddPost />} />
        ),
      },
      {
        path: "/post/:id",
        element: (
          <ProtectedRoute element={<SinglePost />} />
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <ProtectedRoute element={<EditPost />} />
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
