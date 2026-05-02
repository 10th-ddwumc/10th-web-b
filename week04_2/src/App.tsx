// src/App.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";
import NotFoundPage from "./pages/NotFoundPage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },

      { path: "v1/auth/google/callback", element: <GoogleCallbackPage /> },

      {
        element: <ProtectedRoute />,
        children: [{ path: "mypage", element: <MyPage /> }],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;