// src/pages/LpListPage.tsx
import { useState } from "react";
import LpCard from "../components/lp/LpCard";
import LpCardSkeleton from "../components/lp/LpCardSkeleton";
import LoadingError from "../components/common/LoadingError";
import { useInfiniteLpList } from "../hooks/useInfiniteLpList";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import type { Lp, SortType } from "../types/lp";
import "../styles/LpPage.css";

const LpListPage = () => {
  const [sort, setSort] = useState<SortType>("latest");

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteLpList(sort);

  const lpList = data?.pages.flatMap((page) => page.data.data) ?? [];

  const observerRef = useIntersectionObserver({
    enabled: !!hasNextPage && !isFetchingNextPage,
    onIntersect: () => {
      fetchNextPage();
    },
  });

  return (
    <section className="lp-list-page">
      <div className="sort-buttons">
        <button
          type="button"
          className={sort === "oldest" ? "active" : ""}
          onClick={() => setSort("oldest")}
        >
          오래된순
        </button>
        <button
          type="button"
          className={sort === "latest" ? "active" : ""}
          onClick={() => setSort("latest")}
        >
          최신순
        </button>
      </div>

      {isLoading && (
        <div className="lp-grid">
          {Array.from({ length: 12 }).map((_, index) => (
            <LpCardSkeleton key={index} />
          ))}
        </div>
      )}

      {isError && <LoadingError onRetry={() => refetch()} />}

      {!isLoading && !isError && (
        <>
          <div className="lp-grid">
            {lpList.map((lp: Lp) => (
              <LpCard key={lp.id} lp={lp} />
            ))}

            {isFetchingNextPage &&
              Array.from({ length: 8 }).map((_, index) => (
                <LpCardSkeleton key={`next-${index}`} />
              ))}
          </div>

          <div ref={observerRef} className="infinite-trigger" />

          {!hasNextPage && lpList.length > 0 && (
            <p className="end-message">마지막 LP입니다.</p>
          )}
        </>
      )}
    </section>
  );
};

export default LpListPage;