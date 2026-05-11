// src/hooks/useInfiniteLpComments.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpComments } from "../api/lp";
import type { OrderType } from "../types/lp";

export const useInfiniteLpComments = (
  lpid: string | undefined,
  order: OrderType
) => {
  return useInfiniteQuery({
    queryKey: ["lpComments", lpid, order],
    queryFn: ({ pageParam = 0 }) =>
      getLpComments({
        lpid: lpid!,
        order,
        cursor: pageParam,
        limit: 10,
      }),
    enabled: !!lpid,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data.hasNext) return undefined;
      return lastPage.data.nextCursor;
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};