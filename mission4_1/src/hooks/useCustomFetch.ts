import { useEffect, useState } from "react";
import axios from "axios";

// 공통으로 사용할 fetch 훅
const useCustomFetch = <T>(url: string) => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!url) return;
            
            setIsLoading(true);
            setIsError(null);

            try {
                const response = await axios.get<T>(url, {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                    },
                });
                setData(response.data);
            } catch (err) {
                console.error("API Fetch Error:", err);
                setIsError("데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, isLoading, isError };
};

export default useCustomFetch;