import { useEffect, useState } from "react";

function App() {
  const [path, setPath] = useState(window.location.pathname);

  const navigate = (to: string) => {
    window.history.pushState({}, "", to);
    setPath(to);
  };

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const renderPage = () => {
    if (path === "/about") {
      return <h2>About 페이지입니다.</h2>;
    }

    if (path === "/contact") {
      return <h2>Contact 페이지입니다.</h2>;
    }

    return <h2>Home 페이지입니다.</h2>;
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>간단한 SPA 만들기</h1>

      <nav style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/about")}>About</button>
        <button onClick={() => navigate("/contact")}>Contact</button>
      </nav>

      <p>현재 경로: {path}</p>

      <div>{renderPage()}</div>
    </div>
  );
}

export default App;