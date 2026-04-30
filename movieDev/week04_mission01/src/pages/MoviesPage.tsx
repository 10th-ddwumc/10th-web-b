import { useNavigate, useParams } from "react-router-dom";
import useCustomFetch from "../hooks/useCustomFetch";
import type { MovieResponse } from "../types/movie";

const MoviesPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const url = `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=1`;

  const { data, isLoading, error } = useCustomFetch<MovieResponse>(url);
  const movies = data?.results ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-700 border-t-white rounded-full animate-spin"></div>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-8 py-10">
      <h2 className="text-3xl font-bold mb-8 capitalize">{category}</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => navigate(`/movies/detail/${movie.id}`)}
            className="relative cursor-pointer rounded-xl overflow-hidden group bg-zinc-900"
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/500x750?text=No+Image"
              }
              alt={movie.title}
              className="w-full h-[420px] object-cover transition duration-300 group-hover:scale-105 group-hover:blur-sm"
            />

            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-center p-4">
              <h3 className="font-bold mb-2 text-lg">{movie.title}</h3>
              <p className="text-sm text-gray-300 line-clamp-5">
                {movie.overview || "줄거리 정보가 없습니다."}
              </p>
              <p className="text-sm text-gray-400 mt-3">
                평점: {movie.vote_average}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;