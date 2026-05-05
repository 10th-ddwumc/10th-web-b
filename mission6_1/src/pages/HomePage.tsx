import FloatingButton from "../components/Floatingbutton";
import useGetCatList from "../hooks/useGetCatList";
import { useState } from "react";
import type { Cat } from "../types/cat";
import CatCardSkeleton from "../components/CatCardSkeleton";

import { Link } from "react-router-dom";

const HomePage = () => {

    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const [search, setSearch] = useState("");
    const [cursor, setCursor] = useState(0);

    const { data, isPending, isError, refetch } = useGetCatList({
        cursor,
        search,
        order: order,
        limit: 10,
    });

    const cats: Cat[] = data?.data?.data ?? [];
    const nextCursor = (data as any)?.data?.nextCursor;
    const hasNext = data?.data?.hasNext;
    const skeletonCount = cats.length || 8;

    console.log("cats:", cats);
    console.log("length:", cats.length);

    if (isPending) return <CatCardSkeleton />;
    if (isError) return <div> 문제가 생겼고영🐈‍⬛ </div>;

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

            {isPending &&
                 Array.from({ length: skeletonCount }).map((_, i) => (
                <CatCardSkeleton key={i} />
            ))}

            {isError && (
                <div>
                    문제가 생겼고영🐈‍⬛
                    <button onClick={() => (refetch as any)?.()}>다시 시도</button>
                </div>
            )}

             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cats.map((cat: any) => (
          <Link
            key={cat.id}
            to={`/cat/${cat.id}`}
            className="group relative border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* 이미지 컨테이너 */}
            <div className="w-full h-64 overflow-hidden bg-gray-100">
              <img
                src={cat.thumbnail}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* 호버 시 나타나는 오버레이 메타 정보 */}
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

      {hasNext && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setCursor(nextCursor)}
            className="px-4 py-2 border rounded"
          >
            더보기
          </button>
        </div>
      )}
        </div>
        </>
    );
};

export default HomePage;