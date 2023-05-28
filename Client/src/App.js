//import logo from './logo.svg';
import './App.css';
import { Login } from './pages/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {

  const {user} =  useContext(AuthContext)
  return (
    <BrowserRouter>
      <Routes>
      {user ? (
          <Route path="/" element={<Home />} />
        ) : (
          <Route path="/" element={<Login />} />
        )}
        <Route path="/user/auth" element={<Login />} />
      </Routes> 
    </BrowserRouter>
  );
}

export default App;
