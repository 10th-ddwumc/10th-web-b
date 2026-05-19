import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../store/authStore'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!user) {
      alert('로그인이 필요한 서비스입니다. 로그인을 해주세요!')
      navigate('/login', { state: { from: location.pathname } })
    }
  }, [user])

  if (!user) return null
  return <>{children}</>
}