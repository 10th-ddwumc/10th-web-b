import { useQuery } from '@tanstack/react-query'
import { fetchLpList } from '../apis/lp'
import type { SortType } from '../types/lp'

export function useLpList(sort: SortType) {
  return useQuery({
    queryKey: ['lps', sort],
    queryFn: () => fetchLpList(sort),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  })
}