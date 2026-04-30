import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import './App.css';

function App() {
  const [email, setEmail] = useState('');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage setEmail={setEmail} />} />
        <Route path="/auth/google/callback" element={<GoogleCallbackPage setEmail={setEmail} />} />
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage email={email} />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;