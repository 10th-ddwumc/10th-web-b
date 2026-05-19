import FloatingButton from "../components/Floatingbutton";
import PostModal from "../components/PostModal";
import useGetCatList from "../hooks/useGetCatList";
import { useState, useEffect, useRef } from "react";
import type { Cat } from "../types/cat";
import CatCardSkeleton from "../components/CatCardSkeleton";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDebounce } from "../hooks/useDebounce";
import { Search } from "lucide-react";

const HomePage = () => {
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const initialSearch = searchParams.get("search") || "";

    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const [searchInput, setSearchInput] = useState(initialSearch);
    const debouncedSearch = useDebounce(searchInput, 300); 
    const [isModalOpen, setIsModalOpen] = useState(false);

    // URL 파라미터가 변경될 때 입력창 상태 동기화 (뒤로가기/검색 클릭 대응)
    useEffect(() => {
        const querySearch = searchParams.get("search") || "";
        if (searchInput !== querySearch) {
            setSearchInput(querySearch);
        }
    }, [searchParams]); 
    
    // 검색어가 변경될 때 URL 파라미터 업데이트
    useEffect(() => {
        if (debouncedSearch) {
            setSearchParams({ search: debouncedSearch }, { replace: true });
        } else {
            setSearchParams({}, { replace: true });
        }
    }, [debouncedSearch, setSearchParams]);

    // 하나의 훅으로 검색과 전체 목록 통합 관리
    const { 
        data, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage, 
        isLoading, 
        isError, 
        refetch 
    } = useGetCatList({
        search: debouncedSearch.trim() || undefined,
        order,
        limit: 10,
    });

    const isSearching = !!debouncedSearch.trim();

    const observerElem = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!observerElem.current || !hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(observerElem.current);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const cats: Cat[] = data?.pages.flatMap(page => page.data.data) ?? [];

    const handleCreateClick = () => {
        if (!accessToken) {
            alert("로그인이 필요한 기능입니다.");
            navigate("/login");
            return;
        }
        setIsModalOpen(true);
    };

    if (isError) return (
        <div className="p-4 text-center">
            문제가 생겼고영🐈‍⬛
            <button onClick={() => refetch()} className="ml-2 px-4 py-2 border rounded">다시 시도</button>
        </div>
    );

    return (
        <>
        <FloatingButton onClick={handleCreateClick} />
        <PostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <div className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <input 
                        type="text" 
                        value={searchInput} 
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="고양이 검색..."
                        className="w-full p-3 pl-10 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setOrder("asc")}
                        className={`px-4 py-2 rounded-lg transition-all ${order === "asc" ? "bg-blue-600 text-white font-bold" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                        오름차순
                    </button>
                    <button
                        onClick={() => setOrder("desc")}
                        className={`px-4 py-2 rounded-lg transition-all ${order === "desc" ? "bg-blue-600 text-white font-bold" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                        내림차순
                    </button>
                </div>
            </div>

            {isSearching && (
                <p className="mb-4 text-gray-600">
                    "<span className="font-bold">{debouncedSearch}</span>" 검색 결과
                </p>
            )}

            {isLoading && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <CatCardSkeleton key={`loading-${i}`} />
                    ))}
                </div>
            )}

            {!isLoading && cats.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    검색 결과가 없고영 🐈
                </div>
            )}

             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cats.map((cat: Cat) => (
                  <Link
                    key={cat.id}
                    to={`/cat/${cat.id}`}
                    className="group relative border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="w-full h-64 overflow-hidden bg-gray-100">
                      <img
                        src={cat.thumbnail}
                        alt={cat.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                      <h3 className="font-bold text-lg line-clamp-2 mb-1">
                        {cat.title}
                      </h3>
                      <div className="flex justify-between items-center text-sm">
                        <p className="text-gray-300">
                          {new Date(cat.createdAt).toLocaleDateString()}
                        </p>
                        <p className="font-medium flex items-center gap-1">
                          ❤️ {cat.likes?.length ?? 0}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>

            {isFetchingNextPage && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <CatCardSkeleton key={`fetching-${i}`} />
                    ))}
                </div>
            )}

            <div ref={observerElem} className="h-10 w-full" />
        </div>
        </>
    );
};

export default HomePage;
