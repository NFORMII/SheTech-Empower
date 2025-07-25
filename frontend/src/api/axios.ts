import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;


if (!baseURL) {
  throw new Error("REACT_APP_API_BASE_URL is not defined");
}

const api = axios.create({
  baseURL,
  withCredentials: false,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;