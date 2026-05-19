// src/pages/SearchPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import { useInfiniteSearchLps } from "../hooks/useInfiniteSearchLps";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import type { Lp } from "../types/lp";
import "../styles/SearchPage.css";

const SearchPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 300);

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteSearchLps(debouncedKeyword);

  const observerRef = useIntersectionObserver({
    enabled: !!hasNextPage && !isFetchingNextPage,
    onIntersect: () => fetchNextPage(),
  });

  const lps = data?.pages.flatMap((page) => page.data.data) ?? [];

  return (
    <main className="search-page">
      <section className="search-area">
        <div className="search-input-row">
          <span className="search-icon">🔍</span>
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="검색어를 입력해주세요"
          />
          <select>
            <option>제목</option>
          </select>
        </div>

        <div className="recent-keyword-row">
          <strong>최근 검색어</strong>
          <button type="button">모두 지우기</button>
        </div>
      </section>

      {keyword.trim().length === 0 && (
        <p className="search-empty-text">검색어를 입력해주세요.</p>
      )}

      {isLoading && (
        <div className="search-grid">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="search-card-skeleton" />
          ))}
        </div>
      )}

      {isError && (
        <p className="search-empty-text">검색 결과를 불러오지 못했습니다.</p>
      )}

      {!isLoading && !isError && keyword.trim().length > 0 && lps.length === 0 && (
        <p className="search-empty-text">검색 결과가 없습니다.</p>
      )}

      {!isLoading && !isError && lps.length > 0 && (
        <div className="search-grid">
          {lps.map((lp: Lp) => (
            <button
              type="button"
              key={lp.id}
              className="search-card"
              onClick={() => navigate(`/lp/${lp.id}`)}
            >
              <img src={lp.thumbnail} alt={lp.title} />
            </button>
          ))}

          {isFetchingNextPage &&
            Array.from({ length: 6 }).map((_, index) => (
              <div key={`next-${index}`} className="search-card-skeleton" />
            ))}

          <div ref={observerRef} className="search-trigger" />
        </div>
      )}
    </main>
  );
};

export default SearchPage;