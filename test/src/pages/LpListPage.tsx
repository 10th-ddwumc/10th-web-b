// src/pages/LpListPage.tsx
import { useState } from "react";
import LpCard from "../components/lp/LpCard";
import LpCardSkeleton from "../components/lp/LpCardSkeleton";
import LoadingError from "../components/common/LoadingError";
import { useLpList } from "../hooks/useLpList";
import type { Lp, SortType } from "../types/lp";
import "../styles/LpPage.css";

const LpListPage = () => {
  const [sort, setSort] = useState<SortType>("latest");
  const { data, isLoading, isError, refetch } = useLpList(sort);

  const lpList = data?.data?.data ?? [];

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
          {Array.from({ length: 15 }).map((_, index) => (
            <LpCardSkeleton key={index} />
          ))}
        </div>
      )}

      {isError && <LoadingError onRetry={() => refetch()} />}

      {!isLoading && !isError && (
        <div className="lp-grid">
          {lpList.map((lp: Lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))}
        </div>
      )}
    </section>
  );
};

export default LpListPage;