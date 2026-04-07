import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import type { Movie, MovieResponse } from "../types/movie";

const MoviesPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    if (!category) return;

    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNjYzMjk0Mjk0OWQ5NGZmNTFkYzAyMGEyZTg3N2Q5ZiIsIm5iZiI6MTc3NDkxOTgwMi4wOTIsInN1YiI6IjY5Y2IyMDdhYWY0ZTI4YWU0N2NhM2JmZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.L-mQWy75DgVf1ZZnzZTOMR0CiM0MlsJSUsdVF4PemPE`,
            },
          }
        );

        setMovies(response.data.results);
      } catch (err) {
        setError("영화 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [category, page]);

  const getPageTitle = () => {
    switch (category) {
      case "popular":
        return "인기 영화";
      case "top_rated":
        return "평점 높은 영화";
      case "upcoming":
        return "개봉 예정 영화";
      case "now_playing":
        return "상영 중 영화";
      default:
        return "영화 목록";
    }
  };

  if (isLoading) {
    return (
      <div className="page-state">
        <div className="spinner"></div>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-state">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="movies-page">
      <h1 className="page-title">{getPageTitle()}</h1>

      <div className="movie-grid">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="movie-card"
            onClick={() => navigate(`/movies/detail/${movie.id}`)}
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/500x750?text=No+Image"
              }
              alt={movie.title}
              className="movie-poster"
            />

            <div className="movie-overlay">
              <h3>{movie.title}</h3>
              <p>
                {movie.overview
                  ? movie.overview.length > 120
                    ? `${movie.overview.slice(0, 120)}...`
                    : movie.overview
                  : "줄거리 정보가 없습니다."}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => setPage((prev) => prev - 1)} disabled={page === 1}>
          이전
        </button>

        <span>{page} 페이지</span>

        <button onClick={() => setPage((prev) => prev + 1)}>다음</button>
      </div>
    </div>
  );
};

export default MoviesPage;