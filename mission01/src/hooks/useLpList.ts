import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchLpList } from '../apis/lp'
import type { SortType } from '../types/lp'

export function useLpList(sort: SortType) {
  return useInfiniteQuery({
    queryKey: ['lps', sort],
    queryFn: ({ pageParam }) => fetchLpList({ pageParam: pageParam as number, sort }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.hasNext ? lastPage?.data?.nextCursor : undefined
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  })
}