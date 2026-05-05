import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import LpListPage from './pages/LpListPage'
import LpDetailPage from './pages/LpDetailPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProtectedRoute from './components/common/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<Layout />}>
        <Route path="/" element={<LpListPage />} />
        <Route
          path="/lp/:lpid"
          element={
            <ProtectedRoute>
              <LpDetailPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}