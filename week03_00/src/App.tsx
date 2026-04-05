import { Link } from './router/Link';
import { Route, Routes } from './router/Router';

const MatthewPage = () => <h1>매튜 페이지 🍠</h1>;
const AeongPage = () => <h1>애옹 페이지 🐾</h1>;
const JoyPage = () => <h1>조이 페이지 🌟</h1>;
const NotFoundPage = () => <h1>404 Not Found</h1>;

const Header = () => {
  return (
    <nav style={{ display: 'flex', gap: '15px', padding: '20px', borderBottom: '1px solid #ccc' }}>
      <Link to="/matthew">MATTHEW</Link>
      <Link to="/aeong">AEONG</Link>
      <Link to="/joy">JOY</Link>
      <Link to="/not-found">NOT FOUND</Link>
    </nav>
  );
};

function App() {
  return (
    <div>
      <Header />
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/matthew" component={MatthewPage} />
          <Route path="/aeong" component={AeongPage} />
          <Route path="/joy" component={JoyPage} />
          <Route path="/not-found" component={NotFoundPage} />
        </Routes>
      </main>
    </div>
  );
}

export default App;