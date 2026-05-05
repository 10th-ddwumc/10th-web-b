import FloatingButton from "../components/Floatingbutton";
import useGetCatList from "../hooks/useGetCatList";
import { useState, useEffect, useRef } from "react";
import type { Cat } from "../types/cat";
import CatCardSkeleton from "../components/CatCardSkeleton";
import { Link } from "react-router-dom";

const HomePage = () => {
    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const [search] = useState("");

    const { 
        data, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage, 
        isLoading, 
        isError, 
        refetch 
    } = useGetCatList({
        search,
        order: order,
        limit: 10,
    });

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

    if (isError) return (
        <div className="p-4 text-center">
            문제가 생겼고영🐈‍⬛
            <button onClick={() => refetch()} className="ml-2 px-4 py-2 border rounded">다시 시도</button>
        </div>
    );

    return (
        <>
        <FloatingButton/>
        <div className="p-4">
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setOrder("asc")}
                    className={order === "asc" ? "font-bold" : ""}>
                    오름차순
                </button>
                <button
                    onClick={() => setOrder("desc")}
                    className={order === "desc" ? "font-bold" : ""}>
                        내림차순
                </button>
            </div>

            {isLoading && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <CatCardSkeleton key={`loading-${i}`} />
                    ))}
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