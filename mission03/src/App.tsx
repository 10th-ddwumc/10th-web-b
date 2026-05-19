import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<div style={{ color: 'white' }}>메인 페이지</div>} />
      </Route>
    </Routes>
  )
}