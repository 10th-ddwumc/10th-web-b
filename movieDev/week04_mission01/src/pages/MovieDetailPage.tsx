import { useParams } from "react-router-dom";
import useCustomFetch from "../hooks/useCustomFetch";
import type { CreditsResponse, MovieDetail } from "../types/movie";

// 영화 상세 페이지 컴포넌트
const MovieDetailPage = () => {
  const { movieId } = useParams();

  const detailUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`;
  const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`;

  // 영화 상세 데이터 가져오기
  const {
    data: movie,  // 받아온 데이터 이름을 movie로 사용
    isLoading: movieLoading, // 로딩 상태
    error: movieError, // 에러 상태
  } = useCustomFetch<MovieDetail>(detailUrl);

  // 출연진 데이터 가져오기
  const {
    data: credits,
    isLoading: creditsLoading,
    error: creditsError,
  } = useCustomFetch<CreditsResponse>(creditsUrl);

  // 둘 중 하나라도 로딩 중이면 로딩 화면 보여줌
  if (movieLoading || creditsLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center gap-4">
        {/* Tailwind로 만든 로딩 스피너 */}
        <div className="w-12 h-12 border-4 border-gray-700 border-t-white rounded-full animate-spin"></div>
        <p>로딩 중...</p>
      </div>
    );
  }

  // 에러 발생 시 에러 메시지
  if (movieError || creditsError) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  // 영화 데이터가 없을 경우
  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        영화 정보가 없습니다.
      </div>
    );
  }

  const castList = credits?.cast?.slice(0, 10) ?? [];

  return (
    <div className="min-h-screen bg-black text-white">
      <div
        className="bg-cover bg-center p-8 md:p-10"
        style={{
          backgroundImage: movie.backdrop_path
            ? `linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.4)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : "none",
        }}
      >
        {/* 내용 박스 */}
        <div className="bg-black/50 rounded-2xl p-6 flex flex-col md:flex-row gap-8">
          {/* 영화 포스터 */}
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Image"
            }
            alt={movie.title}
            className="w-64 rounded-xl object-cover"
          />

          {/* 영화 정보 영역 */}
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            <p className="mb-2">평점: {movie.vote_average}</p>
            <p className="mb-2">개봉일: {movie.release_date}</p>
            <p className="mb-2">상영 시간: {movie.runtime}분</p>

            <div className="flex flex-wrap gap-2 mt-4">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="mt-6 text-gray-300 leading-relaxed">
              {movie.overview || "줄거리 정보가 없습니다."}
            </p>
          </div>
        </div>
      </div>

      <div className="px-8 py-10">
        <h2 className="text-3xl font-bold mb-8">감독/출연</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {castList.map((person) => (
            <div key={person.id} className="text-center">
              <img
                src={
                  person.profile_path
                    ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                    : "https://via.placeholder.com/185x278?text=No+Image"
                }
                alt={person.name}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover mx-auto border-2 border-gray-500"
              />
              <h3 className="mt-4 font-bold text-lg">{person.name}</h3>
              <p className="text-sm text-gray-400">{person.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;