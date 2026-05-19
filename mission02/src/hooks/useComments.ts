import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchComments } from '../apis/lp'
import type { OrderType } from '../types/lp'

export function useComments(lpId: string, order: OrderType) {
  return useInfiniteQuery({
    queryKey: ['lpComments', lpId, order],
    queryFn: ({ pageParam }) =>
      fetchComments({ pageParam: pageParam as number, lpId, order }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.hasNext ? lastPage?.data?.nextCursor : undefined
    },
    enabled: !!lpId,
    staleTime: 1000 * 60,
  })
}