import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLpDetail } from '../hooks/useLpDetail'
import { useComments } from '../hooks/useComments'
import { likeLp, deleteLp, createComment } from '../apis/lp'
import { useAuth } from '../store/authStore'
import CommentSkeleton from '../components/lp/CommentSkeleton'
import type { Comment, OrderType } from '../types/lp'

export default function LpDetailPage() {
  const { lpid } = useParams<{ lpid: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [commentText, setCommentText] = useState('')
  const [order, setOrder] = useState<OrderType>('desc')
  const bottomRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, isError, refetch } = useLpDetail(lpid!)
  const { data: commentData, isLoading: isCommentLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useComments(lpid!, order)

  const lp = data?.data

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

  const allComments = commentData?.pages.flatMap((page) => page?.data?.data ?? []) ?? []

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

  const commentMutation = useMutation({
    mutationFn: () => createComment({ lpId: lpid!, content: commentText }),
    onSuccess: () => {
      setCommentText('')
      queryClient.invalidateQueries({ queryKey: ['lpComments', lpid] })
    },
  })

  if (isLoading) return <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>불러오는 중...</div>
  if (isError) return (
    <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>
      <p>오류가 발생했어요 😢</p>
      <button onClick={() => refetch()} style={styles.retryBtn}>다시 시도</button>
    </div>
  )

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.metaRow}>
          <div style={styles.authorInfo}>
            {lp?.author?.avatar && <img src={lp.author.avatar} alt="" style={styles.avatar} />}
            <span style={styles.authorName}>{lp?.author?.name}</span>
          </div>
          <span style={styles.date}>{lp?.createdAt ? new Date(lp.createdAt).toLocaleDateString('ko-KR') : ''}</span>
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
            ♥ {lp?.likes?.length ?? 0}
          </button>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div style={styles.commentSection}>
        <div style={styles.commentHeader}>
          <h3 style={styles.commentTitle}>댓글</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setOrder('asc')} style={{ ...styles.sortBtn, ...(order === 'asc' ? styles.sortActive : {}) }}>오래된순</button>
            <button onClick={() => setOrder('desc')} style={{ ...styles.sortBtn, ...(order === 'desc' ? styles.sortActive : {}) }}>최신순</button>
          </div>
        </div>

        <div style={styles.commentInput}>
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="댓글을 입력해주세요"
            style={styles.input}
            onKeyDown={(e) => { if (e.key === 'Enter' && commentText.trim()) commentMutation.mutate() }}
          />
          <button onClick={() => commentMutation.mutate()} disabled={!commentText.trim()} style={styles.submitBtn}>작성</button>
        </div>

        {isCommentLoading && Array.from({ length: 5 }).map((_, i) => <CommentSkeleton key={i} />)}

        {!isCommentLoading && allComments.map((comment: Comment) => (
          <div key={comment.id} style={styles.commentItem}>
            <div style={styles.commentAuthorRow}>
              {comment.author?.avatar ? (
                <img src={comment.author.avatar} alt="" style={styles.commentAvatar} />
              ) : (
                <div style={styles.commentAvatarDefault}>{comment.author?.name?.[0] ?? '?'}</div>
              )}
              <div>
                <p style={styles.commentAuthor}>{comment.author?.name}</p>
                <p style={styles.commentContent}>{comment.content}</p>
              </div>
            </div>
          </div>
        ))}

        {isFetchingNextPage && Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)}

        <div ref={bottomRef} style={{ height: '20px' }} />
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: '700px', margin: '0 auto', padding: '24px' },
  card: { backgroundColor: '#1e1e1e', borderRadius: '12px', padding: '32px', marginBottom: '24px' },
  metaRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  authorInfo: { display: 'flex', alignItems: 'center', gap: '8px' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' },
  authorName: { color: '#ccc', fontSize: '14px' },
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
  retryBtn: { backgroundColor: '#e91e8c', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer' },
  commentSection: { backgroundColor: '#1e1e1e', borderRadius: '12px', padding: '24px' },
  commentHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  commentTitle: { color: 'white', fontSize: '18px', margin: 0 },
  sortBtn: { backgroundColor: '#333', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' },
  sortActive: { backgroundColor: '#555' },
  commentInput: { display: 'flex', gap: '8px', marginBottom: '20px' },
  input: { flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: 'white', fontSize: '14px' },
  submitBtn: { backgroundColor: '#e91e8c', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  commentItem: { borderBottom: '1px solid #2a2a2a', padding: '12px 0' },
  commentAuthorRow: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
  commentAvatar: { width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' as const, flexShrink: 0 },
  commentAvatarDefault: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e91e8c', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 },
  commentAuthor: { color: 'white', fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px' },
  commentContent: { color: '#ccc', fontSize: '14px', margin: 0 },
}