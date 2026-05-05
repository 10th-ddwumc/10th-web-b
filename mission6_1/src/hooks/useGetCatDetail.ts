import { useQuery } from "@tanstack/react-query";
import { getCatDetail } from "../apis/cat";

export const useGetCatDetail = (id: string | undefined) => {
    return useQuery({
        queryKey: ["cat", id],
        queryFn: () => getCatDetail(id!),
        enabled: !!id,
    });
};