import { NavLink, Outlet } from 'react-router-dom'
import type { NavLinkRenderProps } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='layout'>
      <nav className='navBar'>
        <NavLink
          to='/'
          end
          className={({ isActive }: NavLinkRenderProps) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          홈
        </NavLink>

        <NavLink
          to='/popular'
          className={({ isActive }: NavLinkRenderProps) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          인기 영화
        </NavLink>

        <NavLink
          to='/now-playing'
          className={({ isActive }: NavLinkRenderProps) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          상영 중
        </NavLink>

        <NavLink
          to='/top-rated'
          className={({ isActive }: NavLinkRenderProps) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          평점 높은
        </NavLink>

        <NavLink
          to='/upcoming'
          className={({ isActive }: NavLinkRenderProps) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          개봉 예정
        </NavLink>
      </nav>

      <main className='content'>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout