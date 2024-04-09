/* eslint-disable space-before-function-paren */
import React, { useContext } from 'react';

import axios from 'axios';
import { BACKEND_URL } from '../config';
import { UserContext } from '../App';

const LogoutButton = () => {
  const { token, removeToken } = useContext(UserContext);
  const handleLogout = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/admin/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      removeToken(token);
    } catch (err) {
      const msg = err.response.data.error;
      alert(msg);
    }
  };
  return <button onClick={handleLogout}>Logout </button>;
};

export default LogoutButton;
