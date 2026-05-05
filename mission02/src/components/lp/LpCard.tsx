import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Lp } from '../../types/lp'

interface LpCardProps {
  lp: Lp
}

export default function LpCard({ lp }: LpCardProps) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/lp/${lp.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={styles.card}
    >
      <img
        src={lp.thumbnail}
        alt={lp.title}
        style={{ ...styles.img, transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
      />
      {hovered && (
        <div style={styles.overlay}>
          <p style={styles.title}>{lp.title}</p>
          <p style={styles.meta}>{new Date(lp.createdAt).toLocaleDateString('ko-KR')}</p>
          <p style={styles.meta}>♥ {lp.likes?.length ?? 0}</p>
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: { position: 'relative', cursor: 'pointer', overflow: 'hidden', borderRadius: '4px', aspectRatio: '1' },
  img: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' },
  overlay: {
    position: 'absolute', inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'flex-end', padding: '12px',
  },
  title: { color: 'white', fontWeight: 'bold', fontSize: '14px', margin: '0 0 4px' },
  meta: { color: '#ccc', fontSize: '12px', margin: 0 },
}