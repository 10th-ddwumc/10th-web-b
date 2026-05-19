// src/hooks/useInfiniteLpList.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../api/lp";
import type { SortType } from "../types/lp";

export const useInfiniteLpList = (sort: SortType) => {
  return useInfiniteQuery({
    queryKey: ["lps", sort],
    queryFn: ({ pageParam = 0 }) =>
      getLpList({
        sort,
        cursor: pageParam,
        limit: 12,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data.hasNext) return undefined;
      return lastPage.data.nextCursor;
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};