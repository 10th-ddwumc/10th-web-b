import './App.css';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import MovieDetailPage from './pages/MovieDetailPage';

// createBrowserRouter v을 기준으로
// react-router-dom v7(next/js, remix)
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: 'movies/:category',
        element: <MoviePage />,
      },
      { 
        path: 'movies/:category/:movieId',
        element: <MovieDetailPage />,
      }
    ],
  },
]);
// movie/upcoming
// movie/popular
// movie/top_rated
// movie/now_playing
// movie?category=popular 이게 더 Restful하다?
// movie/category/{movie_id} 이걸로 설계
function App() {
  return <RouterProvider router={router} />;
}

export default App;