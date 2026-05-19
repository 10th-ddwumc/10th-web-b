import { useInfiniteQuery } from "@tanstack/react-query";
import { getCatComments } from "../apis/cat";

interface UseGetCatCommentsProps {
    catId: string;
    order?: "asc" | "desc";
    limit?: number;
}

function useGetCatComments({
    catId,
    order = "desc",
    limit = 10,
}: UseGetCatCommentsProps) {
    return useInfiniteQuery({
        queryKey: ['catComments', catId, order],
        queryFn: ({ pageParam = 0 }) =>
            getCatComments(catId, {
                cursor: pageParam as number,
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
        enabled: !!catId,
    });
}

export default useGetCatComments;