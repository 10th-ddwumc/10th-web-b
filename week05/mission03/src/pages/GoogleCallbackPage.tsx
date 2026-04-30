import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface GoogleCallbackPageProps {
  setEmail: (email: string) => void;
}

function GoogleCallbackPage({ setEmail }: GoogleCallbackPageProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const email = searchParams.get('email');

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      if (email) setEmail(email);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, []);

  return <div>로그인 처리 중...</div>;
}

export default GoogleCallbackPage;