// src/App.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // 🔥 layout 적용
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true, // "/" 경로
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;