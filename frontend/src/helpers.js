import axios from 'axios';
import { BACKEND_URL } from './config';

const getUserStore = (token) =>
  axios.get(`${BACKEND_URL}/store`, {
    headers: { Authorization: `Bearer ${token}` },
  });

const putUserStore = (token, store) =>
  axios.put(`${BACKEND_URL}/store`, store, {
    headers: { Authorization: `Bearer ${token}` },
  });

export { getUserStore, putUserStore };
