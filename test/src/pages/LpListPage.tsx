// src/pages/LpListPage.tsx
import { useEffect, useState } from "react";
import LpCard from "../components/lp/LpCard";
import LpCardSkeleton from "../components/lp/LpCardSkeleton";
import LoadingError from "../components/common/LoadingError";
import { useInfiniteLpList } from "../hooks/useInfiniteLpList";
import useThrottle from "../hooks/useThrottle";
import type { Lp, SortType } from "../types/lp";
import "../styles/LpPage.css";

const THROTTLE_INTERVAL = 2000;
const SCROLL_BOTTOM_OFFSET = 300;

const LpListPage = () => {
  const [sort, setSort] = useState<SortType>("latest");
  const [scrollY, setScrollY] = useState(0);

  const throttledScrollY = useThrottle(scrollY, THROTTLE_INTERVAL);

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

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const scrollTop = throttledScrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    const isNearBottom =
      scrollTop + windowHeight >= documentHeight - SCROLL_BOTTOM_OFFSET;

    if (!isNearBottom || !hasNextPage || isFetchingNextPage) return;

    console.log("throttle scroll fetch");
    fetchNextPage();
  }, [throttledScrollY, hasNextPage, isFetchingNextPage, fetchNextPage]);

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

          {!hasNextPage && lpList.length > 0 && (
            <p className="end-message">마지막 LP입니다.</p>
          )}
        </>
      )}
    </section>
  );
};

export default LpListPage;