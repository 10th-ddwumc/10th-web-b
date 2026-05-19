export default function LpCardSkeleton() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      <div style={styles.card}>
        <div style={styles.shimmer} />
      </div>
    </>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: { backgroundColor: '#333', borderRadius: '4px', aspectRatio: '1', overflow: 'hidden', position: 'relative' },
  shimmer: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(90deg, #333 25%, #444 50%, #333 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  },
}