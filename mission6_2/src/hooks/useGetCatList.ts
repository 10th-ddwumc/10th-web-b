import { useInfiniteQuery } from "@tanstack/react-query";
import { getCatList } from "../apis/cat";
import type { PaginationDto } from "../types/common";
import { QUERY_KEY } from "../constants/key";

function useGetCatList({
    search = "",
    order = "asc",
    limit = 10,
}: Partial<PaginationDto> = {}) {
    return useInfiniteQuery({
        queryKey: [QUERY_KEY.cats, order, search, limit],
        queryFn: ({ pageParam = 0 }) =>
            getCatList({
                cursor: pageParam as number,
                search,
                order,
                limit,
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (lastPage.data.hasNext) {
                return lastPage.data.nextCursor;
            }
            return undefined;
        },
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
    });
}

export default useGetCatList;