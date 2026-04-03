import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import type { Cast, CreditsResponse, Crew, MovieDetail } from "../types/movie";

const MovieDetailPage = () => {
  const { movieId } = useParams();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [director, setDirector] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieDetail = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [detailResponse, creditsResponse] = await Promise.all([
          axios.get<MovieDetail>(
            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNjYzMjk0Mjk0OWQ5NGZmNTFkYzAyMGEyZTg3N2Q5ZiIsIm5iZiI6MTc3NDkxOTgwMi4wOTIsInN1YiI6IjY5Y2IyMDdhYWY0ZTI4YWU0N2NhM2JmZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.L-mQWy75DgVf1ZZnzZTOMR0CiM0MlsJSUsdVF4PemPE`,
              },
            }
          ),
          axios.get<CreditsResponse>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNjYzMjk0Mjk0OWQ5NGZmNTFkYzAyMGEyZTg3N2Q5ZiIsIm5iZiI6MTc3NDkxOTgwMi4wOTIsInN1YiI6IjY5Y2IyMDdhYWY0ZTI4YWU0N2NhM2JmZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.L-mQWy75DgVf1ZZnzZTOMR0CiM0MlsJSUsdVF4PemPE`,
              },
            }
          ),
        ]);

        setMovie(detailResponse.data);
        setCast(creditsResponse.data.cast.slice(0, 20));

        const directorData = creditsResponse.data.crew.find(
          (person: Crew) => person.job === "Director"
        );

        setDirector(directorData ? directorData.name : "정보 없음");
      } catch (err) {
        setError("영화 상세 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  if (isLoading) {
    return (
      <div className="page-state">
        <div className="spinner"></div>
        <p>상세 정보를 불러오는 중...</p>
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

  if (!movie) {
    return (
      <div className="page-state">
        <p>영화 정보가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div
        className="detail-hero"
        style={{
          backgroundImage: movie.backdrop_path
            ? `linear-gradient(to right, rgba(0,0,0,0.92), rgba(0,0,0,0.5)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : "none",
        }}
      >
        <div className="detail-content">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Image"
            }
            alt={movie.title}
            className="detail-poster"
          />

          <div className="detail-info">
            <h1>{movie.title}</h1>

            <p><strong>평점:</strong> {movie.vote_average.toFixed(1)}</p>
            <p><strong>개봉일:</strong> {movie.release_date || "정보 없음"}</p>
            <p><strong>상영 시간:</strong> {movie.runtime ? `${movie.runtime}분` : "정보 없음"}</p>
            <p><strong>감독:</strong> {director}</p>

            <div className="genre-list">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="genre-badge">
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="overview">{movie.overview || "줄거리 정보가 없습니다."}</p>
          </div>
        </div>
      </div>

      <section className="credits-section">
        <h2>감독/출연</h2>

        <div className="cast-grid">
          {cast.map((person) => (
            <div key={person.id} className="cast-card">
              <img
                src={
                  person.profile_path
                    ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
                    : "https://via.placeholder.com/300x300?text=No+Image"
                }
                alt={person.name}
                className="cast-image"
              />
              <h3>{person.name}</h3>
              <p>{person.character || "배역 정보 없음"}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MovieDetailPage;