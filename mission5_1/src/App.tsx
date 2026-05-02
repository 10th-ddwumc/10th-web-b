import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import HomeLayout from './layouts/HomeLayout';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import type { RouteObject } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedLayout from './layouts/ProtectedLayout';

const publicRoutes:RouteObject[]= [
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
]

const protectedRoutes:RouteObject[]=[
  {
    path: "/",
    element: <ProtectedLayout/>,
    errorElement: <NotFoundPage />,
    children: [
      {path: 'my', element: <MyPage />}, // 마이페이지
    ]
  }
]

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

function App() {
  return <AuthProvider>
    <RouterProvider router={router}/>
  </AuthProvider>

}

export default App;