import { Link } from 'react-router-dom'
import { Search, User } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && <div onClick={onClose} style={styles.overlay} />}
      <aside style={{ ...styles.sidebar, transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
        <nav style={styles.nav}>
          <Link to="/search" style={styles.navItem} onClick={onClose}>
            <Search size={18} /> 찾기
          </Link>
          <Link to="/mypage" style={styles.navItem} onClick={onClose}>
            <User size={18} /> 마이페이지
          </Link>
        </nav>
        <button style={styles.logout}>탈퇴하기</button>
      </aside>
    </>
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 90 },
  sidebar: {
    position: 'fixed', top: '60px', left: 0,
    width: '200px', height: 'calc(100vh - 60px)',
    backgroundColor: '#1a1a1a', zIndex: 95,
    transition: 'transform 0.3s ease',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between', padding: '24px 16px',
  },
  nav: { display: 'flex', flexDirection: 'column', gap: '20px' },
  navItem: { display: 'flex', alignItems: 'center', gap: '10px', color: 'white', textDecoration: 'none', fontSize: '15px' },
  logout: { background: 'none', border: 'none', color: '#888', cursor: 'pointer', textAlign: 'left' },
}