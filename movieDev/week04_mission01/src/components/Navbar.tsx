import { NavLink } from "react-router-dom";

const Navbar = () => {
  const baseClass = "text-gray-400 hover:text-white transition";
  const activeClass = "text-white font-semibold";

  return (
    <header className="bg-black border-b border-gray-800 px-8 py-5 sticky top-0 z-50 text-white">
      <h1 className="text-2xl font-bold mb-3">Movie App</h1>

      <nav className="flex gap-6 text-sm flex-wrap">
        <NavLink
          to="/movies/popular"
          className={({ isActive }) => (isActive ? activeClass : baseClass)}
        >
          인기 영화
        </NavLink>

        <NavLink
          to="/movies/upcoming"
          className={({ isActive }) => (isActive ? activeClass : baseClass)}
        >
          개봉 예정
        </NavLink>

        <NavLink
          to="/movies/top_rated"
          className={({ isActive }) => (isActive ? activeClass : baseClass)}
        >
          평점 높은 영화
        </NavLink>

        <NavLink
          to="/movies/now_playing"
          className={({ isActive }) => (isActive ? activeClass : baseClass)}
        >
          상영 중
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;