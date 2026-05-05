export default function CommentSkeleton() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      <div style={styles.wrapper}>
        <div style={styles.avatar} />
        <div style={styles.lines}>
          <div style={{ ...styles.line, width: '30%' }} />
          <div style={{ ...styles.line, width: '80%' }} />
        </div>
      </div>
    </>
  )
}

const shimmerBg: React.CSSProperties = {
  background: 'linear-gradient(90deg, #333 25%, #444 50%, #333 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: { display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0, ...shimmerBg },
  lines: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
  line: { height: '14px', borderRadius: '4px', ...shimmerBg },
}