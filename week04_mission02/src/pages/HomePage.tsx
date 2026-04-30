import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <h1>홈 화면</h1>
      <button onClick={() => navigate("/login")}>로그인 페이지로 이동</button>
    </div>
  );
}

export default HomePage;