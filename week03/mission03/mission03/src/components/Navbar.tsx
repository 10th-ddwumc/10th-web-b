import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">Movie App</h2>

      <div className="nav-links">
        <NavLink to="/movies/popular">인기 영화</NavLink>
        <NavLink to="/movies/upcoming">개봉 예정</NavLink>
        <NavLink to="/movies/top_rated">평점 높은</NavLink>
        <NavLink to="/movies/now_playing">상영 중</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;