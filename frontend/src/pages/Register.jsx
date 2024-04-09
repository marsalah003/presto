import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../config';
import axios from 'axios';
import { putUserStore } from '../helpers';
const Register = () => {
  const { handleToken, setUserData } = useContext(UserContext);
  const [form, setForm] = useState({
    email: '',
    name: '',
    password: ',',
    confirmPassword: '',
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  });
  const onChange = (v, name) => setForm((prev) => ({ ...prev, [name]: v }));
  const onSubmit = async (e) => {
    e.preventDefault();
    // check that passwords match HERE
    try {
      const { name, email, password } = form;
      const {
        data: { token },
      } = await axios.post(`${BACKEND_URL}/admin/auth/register`, {
        name,
        email,
        password,
      });
      await putUserStore(token, { store: { presentations: [] } });
      handleToken(token);
      setUserData({ name, email });
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response.data.error;
      alert(msg);
    }
  };
  return (
    <>
      {' '}
      <h1> This is the register page</h1>
      <form method='POST' onSubmit={onSubmit}>
        Email:{' '}
        <input
          type='text'
          name='email'
          onChange={({ target: { value, name } }) => onChange(value, name)}
          value={form.email}
        />
        <br />
        Name:{' '}
        <input
          type='text'
          name='name'
          onChange={({ target: { value, name } }) => onChange(value, name)}
          value={form.name}
        />{' '}
        <br />
        password:{' '}
        <input
          type='password'
          name='password'
          onChange={({ target: { value, name } }) => onChange(value, name)}
          value={form.password}
        />{' '}
        <br />
        ConfirmPassword:{' '}
        <input
          type='password'
          name='confirmPassword'
          onChange={({ target: { value, name } }) => onChange(value, name)}
          value={form.confirmPassword}
        />
        <button> Register</button>
      </form>
    </>
  );
};
export default Register;
