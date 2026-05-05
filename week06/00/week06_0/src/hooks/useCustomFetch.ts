import { useEffect, useMemo, useRef, useState } from "react";

const STALE_TIME = 5 * 60 * 1_000; //5m
//1초마다 재시도 3번 반복
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1_000; //1s

//로컬스토리지에 저장할 D 구조
interface CacheEntry<T> {
  data: T;
  lastFetched: number; //마지막으로 D 가져온 시점 타임스탬프
}

export const useCustomFetch = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  const storageKey = useMemo(() => url, [url]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);

  useEffect( (): void => {
    abortControllerRef.current = new AbortController();
    // setIsError(false);

    const fetchData = async (currentRetry = 0) => {
      const currentTime = new Date().getTime();
      const cachedItem = localStorage.getItem(storageKey);

      //캐시 D 확인, 신선도 검증
      if(cachedItem) {
        try {
          const cachedData: CacheEntry<T> = JSON.parse(cachedItem);

          //캐시가 신선한 경우 = STALE_TIME 이내
          if(currentTime - cachedData.lastFetched < STALE_TIME) {
            setData(cachedData.data);
            setIsPending(false);
            console.log('캐시된 D 사용', url);
            return;
          }

          //캐시가 만료된 경우
          setData(cachedData.data);
          console.log('만료된 캐시 D 사용', url);
        }catch {
          localStorage.removeItem(storageKey);
          console.warn('캐시 에러: 캐시 삭제함', url);
        }
      }

      setIsPending(true);
      try{
        const response = await fetch(url, {
          signal: abortControllerRef.current?.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const newData = await response.json() as T;
        setData(newData);

        const newCacheEntry: CacheEntry<T> = {
          data: newData,
          lastFetched: new Date().getTime(), //현재 시간 = 타임 스탬프
        };

        localStorage.setItem(storageKey, JSON.stringify(newCacheEntry));

      } catch(error) {
        if(error instanceof Error && error.name === 'AbortError') {
          console.log('요청 취소됨', url);
          return;
        }

        if(currentRetry < MAX_RETRIES) {
          //1 -> 2 -> 4 -> 8
          const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, currentRetry);
          console.log('재시도, ${currentRetry + 1}/${MAX_RETRIES} Retrying ${retryDelay}ms later');

          retryTimeoutRef.current = setTimeout(() => {
            fetchData(currentRetry + 1);
          }, retryDelay)
        }else {
          //최대 재시도 횟수 초과
          setIsError(true);
          setIsPending(false);
          console.log('최대 재시도 횟수 초과', url);
          return;
        }

        setIsError(true);
        console.log(error);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();

    return() => {
      abortControllerRef.current?.abort();

      //예약된 재시도 타이머 취소
      if(retryTimeoutRef.current !== null) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, [url, storageKey]);

  return { data, isPending, isError };
}