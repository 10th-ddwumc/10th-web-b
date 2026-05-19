// src/hooks/useInfiniteSearchLps.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { searchLps } from "../api/search";

export const useInfiniteSearchLps = (keyword: string) => {
  const trimmedKeyword = keyword.trim();

  return useInfiniteQuery({
    queryKey: ["search", trimmedKeyword],
    queryFn: ({ pageParam = 0 }) =>
      searchLps({
        keyword: trimmedKeyword,
        cursor: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
    enabled: trimmedKeyword.length > 0,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
  });
};