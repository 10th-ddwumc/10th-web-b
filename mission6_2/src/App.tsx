import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import HomeLayout from './layouts/HomeLayout';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import CatDetailPage from './pages/CatDetailPage';
import GoogleLoginRedirectPage from './pages/GoogleLoginRedirdctPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedLayout from './layouts/ProtectedLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// ✅ 단일 라우트 트리로 통합
const router = createBrowserRouter([
  {
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      // 🔥 보호 라우트는 내부로!
      {
        element: <ProtectedLayout />,
        children: [
          { path: '/my', element: <MyPage /> },
          { path: '/cat/:id', element: <CatDetailPage /> },
        ],
      },
      { path: '/v1/auth/google/callback', element: <GoogleLoginRedirectPage /> },
    ],
  },
]);

export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default App;