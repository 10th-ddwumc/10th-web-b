import { useParams } from 'react-router-dom';
import type { MovieDetail, MovieCredits } from '../types/movie';
import { LoadingSpinner } from '../components/LoadingSpinner';
import useCustomFetch from '../hooks/useCustomFetch'; // 커스텀 훅 임포트

const MovieDetailPage = () => {
    const { movieId } = useParams<{ movieId: string }>();

    // 상세 정보와 출연진 정보를 각각 커스텀 훅으로 요청
    const { data: movie, isLoading: isMovieLoading, isError: movieError } = 
        useCustomFetch<MovieDetail>(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`);

    const { data: credits, isLoading: isCreditsLoading, isError: creditsError } = 
        useCustomFetch<MovieCredits>(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`);

    // 로딩 및 에러 상태 통합
    const isLoading = isMovieLoading || isCreditsLoading;
    const error = movieError || creditsError ? '영화 상세 정보를 불러오는 데 실패했습니다.' : null;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#0b0f19]">
                <LoadingSpinner />
            </div>
        );
    }
    
    if (error) {
        return <div className="flex justify-center items-center min-h-screen bg-[#0b0f19] text-red-500 text-xl">{error}</div>;
    }
    
    if (!movie) return null;

    const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : '미상';
    const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

    return (
        <div className="min-h-screen bg-[#0b0f19] text-white p-8 md:p-12">
            
            <div 
                className="relative w-full max-w-6xl mx-auto rounded-xl overflow-hidden mb-16 flex flex-col justify-center min-h-[400px]"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(11, 15, 25, 1) 10%, rgba(11, 15, 25, 0.8) 50%, rgba(11, 15, 25, 0) 100%), url(${backdropUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="relative z-10 w-full md:w-1/2 p-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
                    
                    <div className="flex items-center gap-3 text-gray-300 text-sm md:text-base mb-6">
                        <span>평균 {movie.vote_average.toFixed(1)}</span>
                        <span>{releaseYear}</span>
                        {movie.runtime && <span>{movie.runtime}분</span>}
                    </div>

                    {movie.tagline && (
                        <p className="text-lg italic text-gray-200 mb-6 font-semibold">
                            {movie.tagline}
                        </p>
                    )}

                    <p className="text-sm md:text-base text-gray-300 leading-relaxed line-clamp-5">
                        {movie.overview || "등록된 줄거리가 없습니다."}
                    </p>
                </div>
            </div>

            <div className="w-full max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold mb-8">감독/출연</h2>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-8">
                    {credits?.cast.slice(0, 16).map((actor) => (
                        <div key={actor.id} className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-3 border border-gray-700 bg-gray-800">
                                {actor.profile_path ? (
                                    <img 
                                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} 
                                        alt={actor.name} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                                    </div>
                                )}
                            </div>
                            
                            <span className="text-sm font-bold text-gray-100 truncate w-full">
                                {actor.name}
                            </span>
                            <span className="text-xs text-gray-400 truncate w-full mt-1">
                                {actor.character}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default MovieDetailPage;