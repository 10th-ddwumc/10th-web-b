import { useState, useEffect, useRef } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import { useSearchLps } from '../hooks/useSearchLps'
import LpCard from '../components/lp/LpCard'
import LpCardSkeleton from '../components/lp/LpCardSkeleton'
import type { Lp } from '../types/lp'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const bottomRef = useRef<HTMLDivElement>(null)

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchLps(debouncedQuery)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )
    if (bottomRef.current) observer.observe(bottomRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const allLps = data?.pages.flatMap((page) => page?.data?.data ?? []) ?? []

  return (
    <div style={styles.container}>
      <div style={styles.searchBox}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어를 입력하세요"
          style={styles.input}
          autoFocus
        />
      </div>

      {!debouncedQuery.trim() && (
        <p style={styles.hint}>검색어를 입력해주세요</p>
      )}

      {isLoading && debouncedQuery.trim() && (
        <div style={styles.grid}>
          {Array.from({ length: 10 }).map((_, i) => <LpCardSkeleton key={i} />)}
        </div>
      )}

      {isError && (
        <p style={styles.hint}>검색 중 오류가 발생했어요 😢</p>
      )}

      {!isLoading && !isError && debouncedQuery.trim() && allLps.length === 0 && (
        <p style={styles.hint}>검색 결과가 없어요</p>
      )}

      {!isLoading && !isError && allLps.length > 0 && (
        <div style={styles.grid}>
          {allLps.map((lp: Lp) => <LpCard key={lp.id} lp={lp} />)}
        </div>
      )}

      {isFetchingNextPage && (
        <div style={styles.grid}>
          {Array.from({ length: 10 }).map((_, i) => <LpCardSkeleton key={i} />)}
        </div>
      )}

      <div ref={bottomRef} style={{ height: '20px' }} />
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '24px' },
  searchBox: { marginBottom: '24px' },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #333',
    backgroundColor: '#2a2a2a',
    color: 'white',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '4px' },
  hint: { color: '#888', textAlign: 'center', marginTop: '40px' },
}