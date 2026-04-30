import { useNavigate } from 'react-router-dom';

interface HomePageProps {
  email: string;
}

function HomePage({ email }: HomePageProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <div style={{
      padding: '20px',
      height: '100vh',
      color: '#000000',
    }}>
      <p>{email}님 환영합니다.</p>
      <p>{email}</p>
      <button
        onClick={handleLogout}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: '#5c6bc0',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        로그아웃
      </button>
    </div>
  );
}

export default HomePage;