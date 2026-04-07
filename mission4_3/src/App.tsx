import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import HomeLayout from './layouts/HomeLayout';
import SignupPage from './pages/SignupPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> }, // 홈페이지
      { path: 'login', element: <LoginPage /> }, // 로그인
      { path: 'signup', element: <SignupPage /> }, // 회원가입
    ]
  },
]);

function App() {
  return <RouterProvider router={router} />;

}

export default App;