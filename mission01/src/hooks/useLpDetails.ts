import { useQuery } from '@tanstack/react-query'
import { fetchLpDetail } from '../apis/lp'

export function useLpDetail(lpid: string) {
  return useQuery({
    queryKey: ['lp', lpid],
    queryFn: () => fetchLpDetail(lpid),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    enabled: !!lpid,
  })
}