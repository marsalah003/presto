/* eslint-disable space-before-function-paren */
import React, { useState, createContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Presentation from './pages/Presentation';
const UserContext = createContext();

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const handleToken = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };
  const removeToken = (token) => {
    setToken(null);
    localStorage.removeItem('token');
  };
  return (
    <>
      <BrowserRouter>
        <UserContext.Provider value={{ token, handleToken, removeToken }}>
          <Link to='/login'>Login</Link> | &nbsp;
          <Link to='/register'>Register</Link>
          <Routes>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='register' element={<Register />} />
            <Route path='/' element={<Navigate to='/login' replace={true} />} />
            <Route path='login' element={<Login />} />
            <Route path='presentation/:id' element={<Presentation />} />
            <Route path='*' element={<h1> Page Not Found</h1>} />
          </Routes>
        </UserContext.Provider>
      </BrowserRouter>
    </>
  );
};

export default App;
export { UserContext };
