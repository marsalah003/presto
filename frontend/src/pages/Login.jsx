import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../App';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const { handleToken } = useContext(UserContext);
  const [form, setForm] = useState({
    email: '',
    password: ',',
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/dashboard');
  });
  const onChange = (v, name) => setForm((prev) => ({ ...prev, [name]: v }));
  const onSubmit = async (e) => {
    e.preventDefault();
    // check that passwords match HERE
    try {
      const { email, password } = form;
      const {
        data: { token },
      } = await axios.post(`${BACKEND_URL}/admin/auth/login`, {
        email,
        password,
      });

      handleToken(token);

      navigate('/dashboard');
    } catch (err) {
      const msg = err.response.data.error;
      alert(msg);
    }
  };
  return (
    <>
      {' '}
      <h1> This is the login page</h1>
      <form method='POST' onSubmit={onSubmit}>
        Email:{' '}
        <input
          type='text'
          name='email'
          onChange={({ target: { value, name } }) => onChange(value, name)}
          value={form.email}
        />
        <br />
        password:{' '}
        <input
          type='password'
          name='password'
          onChange={({ target: { value, name } }) => onChange(value, name)}
          value={form.password}
        />{' '}
        <br />
        <button> Login</button>
      </form>
    </>
  );
};

export default Login;
