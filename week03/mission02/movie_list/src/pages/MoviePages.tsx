import { useEffect, useState } from "react"; // 훅 불러오기
import axios from "axios";

type MoviesPageProps = {
  endpoint: string;
};

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
};

type MovieResponse = {
  results: Movie[];
};

const MoviesPage = ({ endpoint }: MoviesPageProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false); // 데이터 불러오는 동안 true로 바뀜
  const [error, setError] = useState<string>(""); // 에러 나면 문구 저장

  useEffect(() => {
    const fetchMovies = async () => {
      try { // 에러가 날 수 있는 코드를 시도하는 구간
        setIsLoading(true); // 데이터 불러오기 시작했으니 로딩 상태 true
        setError(""); // 새로 요청할 때 에러 메시지는 초기화

        const response = await axios.get<MovieResponse>( // axios로 GET 요청 보내기, 응답 데이터 타입은 MovieResponse라고 지정
          `https://api.themoviedb.org/3/movie/${endpoint}?language=ko-KR&page=${page}`, // 요청 주소, endpoint 자리에 popular, top-rated 같은거 들어감
          {
            headers: { 
              Authorization: `Bearer YOUR_API_KEY`,
            },
          }
        );

        setMovies(response.data.results); // 받아온 응답에서 result만 꺼내서 movie에 저장 -> 목록이 다시 렌더링 됨
      } catch (err) { // 위 요청 중 에러가 나면 여기로 들어옴
        console.error(err); // 콘솔에 에러 표시
        setError("에러가 발생했습니다."); // 사용자에게 에러 표시
      } finally { // 성공하든 실패하든 무조건 마지막에 실행됨
        setIsLoading(false); // 로딩 끝낫으니까 false
      }
    };

    fetchMovies(); // 위에서 만든 함수 실제로 실행
  }, [endpoint, page]); // 의존성 배열
  // endpoint가 바뀌거나 page가 바뀌면 useEffect 다시 실행
  // -> 카테고리가 바뀌거나 페이지가 바뀌면 새 데이터 다시 가져옴

  return (
    <div className="px-6 py-8">
      {isLoading ? ( 
        <div className="flex min-h-[60vh] items-center justify-center"> {/* 로딩 스피너를 화면 가운데로 정렬 */}
          <div className="h-14 w-14 animate-spin rounded-full border-[6px] border-gray-300 border-t-green-300"></div> {/* 로딩 스피너 구현, animate-spin: 회전, border-t-green: 위쪽 테두리만 색 다르게 해서 도는 것처럼 만들어줌 */}
        </div>
      ) : error ? ( // 에러 값이 있으면 에러 화면 보여줌
        <div className="mt-10 text-center text-xl font-semibold text-red-400">
          {error}
        </div>
      ) : ( // 로딩도 아니고 에러도 아니면 정상 화면 출력
        <>
          {/* 페이지네이션 영역, mb-8: 아래쪽 여백, flex: 가로 배치, items-center: 세로 가운데 정렬, justify-center: 가로 가운데 정렬, gap-4: 요소들 사이의 간격 */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((prev) => prev - 1)} // 이전 페이지로 이동하는 버튼, prev: 페이지 값, prev - 1 해서 이전 페이지로 이동
              disabled={page === 1} // 현재 페이지가 1 페이지면 비활성화
              className="h-11 w-11 rounded-xl bg-gray-200 text-lg font-bold text-gray-700 shadow disabled:cursor-not-allowed disabled:opacity-40"
            >
              &lt;
            </button>

            <span className="text-base font-semibold">{page} 페이지</span> {/* 현재 페이지 번호 보여줌 */}

            <button
              onClick={() => setPage((prev) => prev + 1)} // 다음 페이지 버튼
              className="h-11 w-11 rounded-xl bg-purple-200 text-lg font-bold text-gray-700 shadow"
            >
              &gt;
            </button>
          </div>

          {/* 영화 리스트 */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="group relative overflow-hidden rounded-2xl shadow-md"
              >
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="h-[320px] w-full object-cover transition duration-300 group-hover:blur-sm group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-[320px] w-full items-center justify-center bg-gray-200 text-gray-500">
                    이미지 없음
                  </div>
                )}

                <div className="absolute inset-0 flex flex-col justify-end bg-black/50 p-4 opacity-0 transition duration-300 group-hover:opacity-100">
                  <h3 className="mb-2 text-lg font-bold text-white">
                    {movie.title}
                  </h3>
                  <p className="line-clamp-4 text-sm text-gray-200">
                    {movie.overview || "줄거리 정보가 없습니다."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MoviesPage;