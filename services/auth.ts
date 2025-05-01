import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/token`, new URLSearchParams({
    username: username,
    password: password,
  }));
  const { access_token } = response.data;
  localStorage.setItem('token', access_token);
  return access_token;
};

export const register = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    username: username,
    password: password,
  });
  return response.data;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};
