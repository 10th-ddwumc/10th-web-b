import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import { useSidebar } from '../../hooks/useSidebar'

export default function Layout() {
  const { isOpen, close, toggle } = useSidebar()

  return (
    <div style={{ backgroundColor: '#111', minHeight: '100vh' }}>
      <Header onMenuClick={toggle} />
      <Sidebar isOpen={isOpen} onClose={close} />
      <main style={{ padding: '24px' }}>
        <Outlet />
      </main>
    </div>
  )
}