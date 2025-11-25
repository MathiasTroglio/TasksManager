import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useState } from 'react';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={token ? <Dashboard logout={logout} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;