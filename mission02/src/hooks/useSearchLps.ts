import { useInfiniteQuery } from '@tanstack/react-query'
import { searchLps } from '../apis/lp'

export function useSearchLps(query: string) {
  return useInfiniteQuery({
    queryKey: ['search', query],
    queryFn: ({ pageParam }) => searchLps({ pageParam: pageParam as number, query }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.hasNext ? lastPage?.data?.nextCursor : undefined
    },
    enabled: !!query.trim(),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  })
}