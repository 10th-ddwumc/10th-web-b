import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLpDetail } from '../hooks/useLpDetail'
import { likeLp, deleteLp } from '../apis/lp'
import { useAuth } from '../store/authStore'

export default function LpDetailPage() {
  const { lpid } = useParams<{ lpid: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data, isLoading, isError, refetch } = useLpDetail(lpid!)

  const lp = data?.data

  const deleteMutation = useMutation({
    mutationFn: () => deleteLp(lpid!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] })
      navigate('/')
    },
  })

  const likeMutation = useMutation({
    mutationFn: () => likeLp(lpid!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lp', lpid] }),
  })

  if (isLoading) return <div style={{ color: 'white', padding: '40px' }}>불러오는 중...</div>
  if (isError) return (
    <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>
      <p>오류가 발생했어요 😢</p>
      <button onClick={() => refetch()} style={{ backgroundColor: '#e91e8c', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer' }}>
        다시 시도
      </button>
    </div>
  )

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.meta}>
          <span style={styles.author}>👤 {lp?.author?.name}</span>
          <span style={styles.date}>{lp?.createdAt}</span>
        </div>

        <div style={styles.titleRow}>
          <h2 style={styles.title}>{lp?.title}</h2>
          {user?.id === lp?.authorId && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => navigate(`/lp/${lpid}/edit`)} style={styles.iconBtn}>✏️</button>
              <button onClick={() => deleteMutation.mutate()} style={styles.iconBtn}>🗑️</button>
            </div>
          )}
        </div>

        <img src={lp?.thumbnail} alt={lp?.title} style={styles.thumbnail} />
        <p style={styles.content}>{lp?.content}</p>

        <div style={styles.tags}>
          {lp?.tags?.map((tag: string) => (
            <span key={tag} style={styles.tag}>#{tag}</span>
        ))}
        </div>

        <div style={styles.likeRow}>
          <button onClick={() => likeMutation.mutate()} style={styles.likeBtn}>
            ♥ {lp?.likes}
          </button>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: '700px', margin: '0 auto', padding: '24px' },
  card: { backgroundColor: '#1e1e1e', borderRadius: '12px', padding: '32px' },
  meta: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px' },
  author: { color: '#ccc', fontSize: '14px' },
  date: { color: '#888', fontSize: '14px' },
  titleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { color: 'white', fontSize: '24px', margin: 0 },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' },
  thumbnail: { width: '100%', maxWidth: '360px', display: 'block', margin: '0 auto 24px', borderRadius: '50%' },
  content: { color: '#ccc', lineHeight: 1.7, marginBottom: '20px' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' },
  tag: { backgroundColor: '#333', color: '#aaa', padding: '4px 10px', borderRadius: '20px', fontSize: '13px' },
  likeRow: { textAlign: 'center' },
  likeBtn: { backgroundColor: 'transparent', border: 'none', color: '#e91e8c', fontSize: '20px', cursor: 'pointer' },
}