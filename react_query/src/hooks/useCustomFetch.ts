import { useQuery } from '@tanstack/react-query'

export const useCustomFetch = <T>(url: string) => {
  return useQuery({
    queryKey: [url],

    queryFn: async ({ signal }): Promise<T> => {
      const response = await fetch(url, { signal })

      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      return response.json() as Promise<T>
    },

    retry: 10,

    // 지수 백오프 전략
    // 1 -> 2 -> 4 -> 8 -> 16 -> 30 -> 30 -> 30 (최대 30초)
    retryDelay: (attemptIndex): number => {
      return Math.min(1000 * Math.pow(2, attemptIndex), 30_000)
    },

    staleTime: 5 * 60 * 1_000,

    // 캐시 초기화 시간: 쿼리가 사용되지 않은 채로 10분이 지나면 캐시에서 제거됨
    gcTime: 10 * 60 * 1_000,
  })
}