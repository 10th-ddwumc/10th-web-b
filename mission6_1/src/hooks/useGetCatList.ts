import { useQuery } from "@tanstack/react-query";
import { getCatList } from "../apis/cat";
import type { PaginationDto } from "../types/common";
import { QUERY_KEY } from "../constants/key";

function useGetCatList({
    cursor = 0,
    search = "",
    order = "asc",
    limit = 10,
}: Partial<PaginationDto> = {}) {
    return useQuery({
        queryKey: [QUERY_KEY.cats, cursor, search, order, limit],
        queryFn: () =>
            getCatList({
                cursor,
                search,
                order,
                limit,
            }),
        
        placeholderData: (prev) => prev,
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5,
    });
}

export default useGetCatList;