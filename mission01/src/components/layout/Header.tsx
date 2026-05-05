import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/authStore'
import { Search } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <button onClick={onMenuClick} style={styles.menuBtn}>
          <svg width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <rect y="10" width="48" height="4" rx="2" fill="white" />
            <rect y="22" width="48" height="4" rx="2" fill="white" />
            <rect y="34" width="48" height="4" rx="2" fill="white" />
          </svg>
        </button>
        <Link to="/" style={styles.logo}>돌려돌려LP판</Link>
      </div>

      <div style={styles.right}>
        <Search size={20} color="white" style={{ cursor: 'pointer' }} />
        {user ? (
          <>
            <span style={styles.welcome}>{user.name}님 반갑습니다.</span>
            <button onClick={handleLogout} style={styles.textBtn}>로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.textBtn}>로그인</Link>
            <Link to="/signup" style={styles.signupBtn}>회원가입</Link>
          </>
        )}
      </div>
    </header>
  )
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: '0 24px',
    height: '60px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  left: { display: 'flex', alignItems: 'center', gap: '16px' },
  right: { display: 'flex', alignItems: 'center', gap: '16px' },
  logo: { color: '#e91e8c', fontWeight: 'bold', fontSize: '20px', textDecoration: 'none' },
  menuBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' },
  welcome: { color: 'white', fontSize: '14px' },
  textBtn: { background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px', textDecoration: 'none' },
  signupBtn: { backgroundColor: '#e91e8c', color: 'white', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' },
}