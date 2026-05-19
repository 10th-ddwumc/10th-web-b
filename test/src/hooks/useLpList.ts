// src/hooks/useLpList.ts
import { useQuery } from "@tanstack/react-query";
import { getLpList } from "../api/lp";
import type { SortType } from "../types/lp";

export const useLpList = (sort: SortType) => {
  return useQuery({
    queryKey: ["lps", sort],
    queryFn: () => getLpList(sort),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};