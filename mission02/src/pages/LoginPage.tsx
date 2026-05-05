import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import axios from 'axios'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('http://localhost:8000/v1/auth/signin', form)
      login(data.data)
      navigate(from)
    } catch {
      alert('로그인 실패. 이메일/비밀번호를 확인해주세요.')
    }
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>로그인</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input placeholder="이메일" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} style={styles.input} />
        <input placeholder="비밀번호" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} style={styles.input} />
        <button type="submit" style={styles.btn}>로그인</button>
      </form>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { maxWidth: '400px', margin: '80px auto', padding: '32px', backgroundColor: '#1e1e1e', borderRadius: '12px' },
  title: { color: 'white', textAlign: 'center', marginBottom: '24px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '12px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: 'white' },
  btn: { padding: '12px', backgroundColor: '#e91e8c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
}