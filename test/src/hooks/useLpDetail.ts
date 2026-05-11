// src/hooks/useLpDetail.ts
import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../api/lp";

export const useLpDetail = (lpid: string | undefined) => {
  return useQuery({
    queryKey: ["lp", lpid],
    queryFn: () => getLpDetail(lpid!),
    enabled: !!lpid,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};