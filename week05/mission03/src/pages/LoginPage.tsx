import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

interface LoginPageProps {
  setEmail: (email: string) => void;
}

function LoginPage({ setEmail }: LoginPageProps) {
  const [email, setLocalEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      setEmailError('올바른 이메일 형식이 아닙니다!');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailError && email && password) {
      try {
        const response = await axiosInstance.post('/v1/auth/signin', {
          email,
          password,
        });
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        setEmail(email);
        navigate('/');
      } catch (e) {
        alert('이메일 또는 비밀번호가 틀렸습니다.');
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/v1/auth/google/login';
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '300px',
      }}>
        <input
          type="text"
          placeholder="이메일"
          value={email}
          onChange={(e) => {
            setLocalEmail(e.target.value);
            validateEmail(e.target.value);
          }}
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: emailError ? '1px solid #e57373' : '1px solid #ccc',
            backgroundColor: emailError ? '#fdecea' : '#fff',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        {emailError && (
          <p style={{ color: '#e57373', fontSize: '12px', margin: '0' }}>
            {emailError}
          </p>
        )}
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: emailError || !email || !password ? '#b0bec5' : '#5c6bc0',
            color: '#fff',
            fontSize: '14px',
            cursor: emailError || !email || !password ? 'not-allowed' : 'pointer',
          }}
        >
          로그인
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#fff',
            color: '#333',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          Google로 로그인
        </button>
      </form>
    </div>
  );
}

export default LoginPage;