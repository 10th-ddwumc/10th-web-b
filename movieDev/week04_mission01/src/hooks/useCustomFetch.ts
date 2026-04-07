import { useEffect, useState } from "react";

// Vite 환경변수에서 TMBD 토큰 가져오기
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

// 제네릭 타입 <T> -> 어떤 데이터 형태든 받을 수 있음
const useCustomFetch = <T,>(url: string) => {
  // 받아온 데이터 저장
  const [data, setData] = useState<T | null>(null);

  // 로딩 상태 (처음엔 true, 요청 끝나면 false)
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 에러 메시지 저장
  const [error, setError] = useState<string>("");

  // url이 바뀔 때마다 실행
  useEffect(() => {
    // 실제 fetch 작업하는 함수
    const fetchData = async () => {
      try {
        setIsLoading(true); // 로딩 시작
        setError(""); // 이전 에러 초기화

        // fetch 요청
        const response = await fetch(url, {
          // 여기서 토큰 사용됨
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        });

        // 요청 실패
        if (!response.ok) {
          throw new Error("데이터 불러오기 실패");
        }
        // JSON으로 변환
        const result = await response.json();
        // 데이터 저장
        setData(result);
      } catch (err) {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        // 성공하든 실패하든 로딩 종료
        setIsLoading(false);
      }
    };

    fetchData(); // 함수 실행
  }, [url]); // url 바뀌면 다시 실행

  // 컴포넌트에서 쓸 값들 반환
  return { data, isLoading, error };
};

export default useCustomFetch;