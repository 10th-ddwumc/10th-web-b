import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLpList } from '../hooks/useLpList'
import LpCard from '../components/lp/LpCard'
import LpCardSkeleton from '../components/lp/LpCardSkeleton'
import type { SortType, Lp } from '../types/lp'

export default function LpListPage() {
  const [sort, setSort] = useState<SortType>('latest')
  const { data, isLoading, isError, refetch } = useLpList(sort)
  const navigate = useNavigate()

  return (
    <div>
      <div style={styles.sortBar}>
        <button
          onClick={() => setSort('oldest')}
          style={{ ...styles.sortBtn, ...(sort === 'oldest' ? styles.active : {}) }}
        >
          오래된순
        </button>
        <button
          onClick={() => setSort('latest')}
          style={{ ...styles.sortBtn, ...(sort === 'latest' ? styles.active : {}) }}
        >
          최신순
        </button>
      </div>

      {isLoading && (
        <div style={styles.grid}>
          {Array.from({ length: 10 }).map((_, i) => <LpCardSkeleton key={i} />)}
        </div>
      )}

      {isError && (
        <div style={styles.errorBox}>
          <p style={{ color: 'white' }}>데이터를 불러오지 못했어요 😢</p>
          <button onClick={() => refetch()} style={styles.retryBtn}>다시 시도</button>
        </div>
      )}

      {!isLoading && !isError && (
        <div style={styles.grid}>
          {data?.data?.data?.map((lp: Lp) => <LpCard key={lp.id} lp={lp} />)}
        </div>
      )}

      <button onClick={() => navigate('/lp/new')} style={styles.fab}>+</button>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  sortBar: { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '16px' },
  sortBtn: { backgroundColor: '#333', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer' },
  active: { backgroundColor: '#555' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '4px' },
  errorBox: { textAlign: 'center', padding: '40px' },
  retryBtn: { backgroundColor: '#e91e8c', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', marginTop: '12px' },
  fab: {
    position: 'fixed', bottom: '32px', right: '32px',
    width: '52px', height: '52px', borderRadius: '50%',
    backgroundColor: '#e91e8c', color: 'white',
    fontSize: '28px', border: 'none', cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
  },
}